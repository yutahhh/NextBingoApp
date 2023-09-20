import type { Metadata } from 'next'
import { useUserSession } from '@/contexts/UserSessionContext';

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
      <header className="bg-blue-500 text-white text-center py-4">
        <h1 className="text-2xl">BINGO APP</h1>
        {creationTime && <p className="text-sm">Account created on: {new Date(creationTime).toLocaleDateString()}</p>}
      </header>
      <main className="container m-auto">
        {children}
      </main>
    </>
  );
}
