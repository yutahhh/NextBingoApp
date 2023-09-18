import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BINGO APP',
  description: 'A simple bingo app built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="bg-blue-500 text-white text-center py-4">
        <h1 className="text-2xl">BINGO APP</h1>
      </header>
      <main className="p-4">
        {children}
      </main>
    </>
  );
}
