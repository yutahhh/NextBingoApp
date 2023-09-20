import React, { useState, useEffect, useCallback } from 'react';
import { Game } from '@/models/game';
import BingoCard from '@/components/BingoCard';
import { 
  listenToGame, 
  listenToPlayers, 
  assignPlayer,
  updatePlayer,
  drawRandomNumber,
  deleteGame
} from '@/utils/DatabaseUtil';
import { createCard } from '@/utils/BingoUtil';
import { useRouter } from 'next/router';
import { useUserSession } from '@/contexts/UserSessionContext';
import { Player } from '@/models/player';

const BingoPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLotteryHistory, setShowLotteryHistory] = useState(false);
  const [game, setGame] = useState(new Game());
  const [members, setMembers] = useState<Player[]>([]);
  const [playerExists, setPlayerExists] = useState(false);
  const [player, setPlayer] = useState(new Player());
  const { state } = useUserSession();
  const { id: gameId } = useRouter().query;
  const router = useRouter();

  const resetPlayer = useCallback(() => {
    setPlayer(currentPlayer => {
      const newCardValues = createCard(game.size);
      return new Player({
        ...currentPlayer.toParams(),
        cardValues: newCardValues.join(','),
        userId: state.userId,
      });
    });
    setPlayerExists(false);
  }, [game.size, state.userId]);

  const updatePlayerName = (newName: string) => {
    const updatedPlayer = new Player({ ...player.toParams(), name: newName });
    setPlayer(updatedPlayer);
    updatePlayer(gameId as string, updatedPlayer);
  };

  const drawNumber = async () => {
    await drawRandomNumber(gameId as string, game.results);
  };

  const finish = async () => {
    await deleteGame(gameId as string);
  }

  useEffect(() => {
    if (!gameId || !state.userId) return;

    listenToGame(gameId as string, (data) => {
      if (!data) {
        router.push('/');
        return;
      }
      setGame(new Game(data));
    });
    listenToPlayers(gameId as string, (data) => {
      const players = data ? Object.values(data).map(p => new Player(p)) : [];
      setMembers(players); // membersを更新
      const foundPlayer = players.find(p => p.userId === state.userId);
      if (foundPlayer) {
        setPlayer(foundPlayer);
        setPlayerExists(true); // playerが存在する場合、playerExistsをtrueに設定
      } else {
        resetPlayer();
      }
      setIsLoading(false);
    });
  }, [
    gameId, 
    state.userId, 
    router,
    resetPlayer
  ]);

  if (isLoading) return null;

  return (
    <div className="max-w-sm m-auto p-4">
      {/* メンバー一覧 */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">メンバー</h2>
        <span>{members.map(player => player.name || '無名').join(', ')}</span>
      </div>
      {/* 抽選履歴 */}
      <div className="mt-4">
        <h2 className="text-xl font-bold">現在の抽選は {game.results[game.results.length - 1]} です</h2>
        <button 
          onClick={() => setShowLotteryHistory(true)}
          className="bg-blue-500 text-white p-2 m-2 shadow-lg"
        >
          抽選履歴を見る
        </button>

        {/* 履歴表示 */}
        {showLotteryHistory && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center p-10" id="popup-overlay">
            <div className="bg-white p-4 rounded-lg">
              <div>{game.results.join(', ')}</div>
              <div className="text-right">
                <button 
                  onClick={() => setShowLotteryHistory(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-lg"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <BingoCard 
        title={game.name || 'BINGO'}
        cols={player.resultValues(game.size, game.results)} 
        bingoPlayers={members.filter(p => p.isBingo(game.size, game.results))}
        reachPlayers={members.filter(p => !p.isBingo(game.size, game.results) && p.isReach(game.size, game.results))}
      />
      {(game.hostId === state.userId) && playerExists && (
        <div className="flex justify-between">
          <div className="flex">
            <button className="bg-red-500 text-white p-2 m-2 shadow-lg" onClick={() => drawRandomNumber(gameId as string, [])}>
              リセット
            </button>
            <button className="bg-blue-500 text-white p-2 m-2 shadow-lg" onClick={drawNumber}>
              抽選する
            </button>
          </div>
          <div className="text-right">
            <button className="bg-gray-500 text-white p-2 m-2 shadow-lg" onClick={finish}>
              終了
            </button>
          </div>
        </div>
      )}
      {playerExists && (
        <div className="mb-6">
          <label htmlFor="playerName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            あなたの名前:
          </label>
          <input
            type="text"
            id="playerName"
            value={player.name}
            onChange={(e) => updatePlayerName(e.target.value)}
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      )}
      {!playerExists && (
        <div>
          <button className="bg-yellow-400 text-white p-2 m-2 shadow-lg" onClick={resetPlayer}>
            再設定
          </button>
          <button className="bg-green-700 text-white p-2 m-2 shadow-lg" onClick={() => assignPlayer(gameId as string, player)}>
            このカードで参加
          </button>
        </div>
      )}
    </div>
  );
};

export default BingoPage;
