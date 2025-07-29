import { Inter } from 'next/font/google'
import Navbar from '../src/Components/Navbar'
import Providers from './providers'
import ThemeContainer from './ThemeContainer'
import ClientOnly from './ClientOnly'
import '../src/index.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientOnly fallback={<div className="min-h-screen bg-neutral-100 flex items-center justify-center">Loading...</div>}>
          <Providers>
            <ThemeContainer>
              <Navbar />
              {children}
            </ThemeContainer>
          </Providers>
        </ClientOnly>
      </body>
    </html>
  )
}
