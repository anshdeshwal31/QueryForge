import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '../components/ThemeProvider'
import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'QueryForge - Document Q&A',
  description: 'Ask questions to your PDFs and docs with Gemini-powered RAG',
  // icons: {
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon.ico',
  //   apple: '/favicon.ico',
  // },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="dark">
        <body className="min-h-screen bg-gray-950 text-white transition-colors">
          <main>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </main>
          <Toaster 
            theme="light"
            position="top-right"
            toastOptions={{
              style: {
                // background: "white",
                color: "black",
                padding: "20px 12px"
              }
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}
