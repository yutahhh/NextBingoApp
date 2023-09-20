import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Game } from '@/models/game'
import { createGame } from '@/utils/DatabaseUtil';
import { useUserSession } from '@/contexts/UserSessionContext';

// MUI
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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
     <Box className="m-auto p-4 max-w-sm">
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            ゲーム名
          </Typography>
          <TextField
            fullWidth
            id="name"
            type="text"
            value={game.name}
            onChange={handleNameChange}
          />
        </Box>
        <Box mb={2}>
          <Typography variant="h6" gutterBottom>
            サイズ{game.size}×{game.size}（奇数）
          </Typography>
          <TextField
            fullWidth
            id="size"
            type="number"
            value={game.size}
            onChange={handleSizeChange}
          />
          {error && <Typography variant="body2" color="error">{error}</Typography>}
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          ホストで開始
        </Button>
      </form>
    </Box>
  );
};

export default IndexPage;
