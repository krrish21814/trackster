import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "./globals.css";
import { Providers } from './utils/providers';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trackster - Goal Management',
  description: 'Track your goals and daily tasks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <Providers>
            {children}
          </Providers>
        </main>
      </body>
    </html>
  )
}