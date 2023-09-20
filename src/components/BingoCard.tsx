import React from 'react';
import { CheckCircle, Notifications } from '@mui/icons-material';
import { Paper, Grid, Typography, Box } from '@mui/material';
import { Player } from '@/models/player';
import { ColType } from '@/types/BingoCardType';

interface BingoCardProps {
  title: string;
  cols: ColType[];
  bingoPlayers?: Player[];
  reachPlayers?: Player[];
};

const BingoCard: React.FC<BingoCardProps> = ({ title, cols, bingoPlayers, reachPlayers }) => {
  return (
    <Box>
      {/* ビンゴの人 */}
      {bingoPlayers?.length > 0 && (
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <CheckCircle style={{ color: '#C8E6C9' }}  />
          <Typography variant="body1">
            {bingoPlayers.map(player => player.name || '無名').join(', ')}
          </Typography>
        </Paper>
      )}
      {/* リーチの人 */}
      {reachPlayers?.length > 0 && (
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
          <Notifications style={{ color: '#FFF176' }} />
          <Typography variant="body1">
            {reachPlayers.map(player => player.name || '無名').join(', ')}
          </Typography>
        </Paper>
      )}
      {/* ビンゴカード */}
      <Paper elevation={3} style={{ padding: '16px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          {title}
        </Typography>
        <Grid container spacing={2}>
          {cols.map((col, index) => (
            <Grid item xs={2.4} key={index}>
              <Paper 
                elevation={col.isBingoCol ? 6 : col.isReachCol ? 4 : 1} 
                style={{
                  height: '48px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  backgroundColor: col.isBingoCol ? '#C8E6C9' : col.isReachCol ? '#FFF176' : '#FFFFFF'
                }}
              >
                {col.isDone ? (
                  <CheckCircle color="disabled" />
                ) : (
                  <Typography variant="h6">{col.num}</Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default BingoCard;
