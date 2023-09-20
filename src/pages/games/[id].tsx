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

// MUI
import { 
  Container, 
  Button, 
  TextField, 
  Typography, 
  Dialog, 
  DialogActions,
  DialogContent, 
  DialogContentText, 
  DialogTitle ,
  Box
} from '@mui/material';

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
    <Container maxWidth="sm">
      <Box py={2}>
        <Typography variant="h5" gutterBottom>
          メンバー
        </Typography>
        <Typography variant="body1" p={2}>
          {members.map(player => player.name || '無名').join(', ')}
        </Typography>
      </Box>
      <Box py={2}>
        <Typography variant="h5" gutterBottom>
          現在の抽選は {game.results[game.results.length - 1]} です
        </Typography>
        <Box p={2}> 
          <Button variant="contained" color="primary" onClick={() => setShowLotteryHistory(true)}>
            抽選履歴を見る
          </Button>
        </Box>
      </Box>

      <Dialog open={showLotteryHistory} onClose={() => setShowLotteryHistory(false)}>
        <DialogTitle>抽選履歴</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {game.results.join(', ')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLotteryHistory(false)} color="primary">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>

      <BingoCard 
        title={game.name || 'BINGO'}
        cols={player.resultValues(game.size, game.results)} 
        bingoPlayers={members.filter(p => p.isBingo(game.size, game.results))}
        reachPlayers={members.filter(p => !p.isBingo(game.size, game.results) && p.isReach(game.size, game.results))}
      />

      {game.hostId === state.userId && playerExists && (
        <Box display="flex" justifyContent="space-between">
          <Box display="flex">
            <Box m={2}>
              <Button variant="contained" color="secondary" onClick={() => drawRandomNumber(gameId as string, [])}>
                リセット
              </Button>
            </Box>
            <Box m={2}>
              <Button variant="contained" color="primary" onClick={drawNumber}>
                抽選する
              </Button>
            </Box>
          </Box>
          <Box m={2}>
            <Button variant="contained" onClick={finish}>
              終了
            </Button>
          </Box>
        </Box>
      )}

      {playerExists && (
        <TextField
          label="あなたの名前"
          value={player.name}
          onChange={(e) => updatePlayerName(e.target.value)}
          fullWidth
          margin="normal"
        />
      )}

      {!playerExists && (
        <Box display="flex">
          <Box m={2}>
            <Button variant="contained" color="warning" onClick={resetPlayer}>
              再設定
            </Button>
          </Box>

          <Box m={2}>
            <Button variant="contained" color="success" onClick={() => assignPlayer(gameId as string, player)}>
              このカードで参加
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default BingoPage;
