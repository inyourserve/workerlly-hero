// app/layout.tsx
'use client'

import { Inter } from 'next/font/google'
import { useEffect } from 'react'
import '../styles/globals.css'
import ReactQueryProvider from '@/lib/react-query'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Add the attributes on the client side
    document.body.setAttribute('data-new-gr-c-s-check-loaded', '14.1215.0')
    document.body.setAttribute('data-gr-ext-installed', '')
  }, [])

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ReactQueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}