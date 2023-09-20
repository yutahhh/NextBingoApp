import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Game } from '@/models/game'
import { createGame } from '@/utils/DatabaseUtil';
import { useUserSession } from '@/contexts/UserSessionContext';

const IndexPage: React.FC = () => {
  const router = useRouter();
  const { state } = useUserSession()
  const [game, setGame] = useState(new Game());
  const [error, setError] = useState("");

  const handleNameChange = (e) => {
    game.name = e.target.value
    setGame(game);
  };

  const handleSizeChange = (e) => {
    game.size = Number(e.target.value)
    setGame(new Game(game.toParams()));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (
      (game.size % 2 === 0 || game.size < 3) ||
      !game.name
    ) {
      setError("サイズは奇数で、かつ3以上である必要があります。");
      return;
    }

    setError("");  // エラーメッセージをクリア
    game.hostId = state.userId
    const key = await createGame(game)
    router.push({
      pathname: '/games/[id]',
      query: { id: key },
    });
  };

  useEffect(() => {
    if (!state.userId) return
  }, [state.userId]);

  return (
    <div className="m-auto p-4 max-w-sm">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            ゲーム名
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            value={game.name}
            onChange={handleNameChange} 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="horizontal">
            サイズ{game.size}×{game.size}（奇数）
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="size"
            type="number"
            value={game.size}
            onChange={handleSizeChange}
          />
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-2 rounded">
          ホストで開始
        </button>
      </form>
    </div>
  );
};

export default IndexPage;
