import type { Metadata } from 'next'
import { useUserSession } from '@/contexts/UserSessionContext';

// MUI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


export const metadata: Metadata = {
  title: 'BINGO APP',
  description: 'A simple bingo app built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { state } = useUserSession();
  const { creationTime } = state;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            BINGO APP
          </Typography>
          {creationTime && (
            <Typography variant="body2" style={{ marginLeft: 'auto' }}>
              Account created on: {new Date(creationTime).toLocaleDateString()}
            </Typography>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <main>
          {children}
        </main>
      </Container>
    </>
  );
}
