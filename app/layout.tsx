'use client'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ReduxProvider from '../util/redux/provider/provider';


//SELESAI

const inter = Inter({ subsets: ['latin'] })




export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
   
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-b from-slate-950  to-slate-900
       via-gray-950`}>
         <ReduxProvider>
        {children}
        </ReduxProvider>
        </body>
    </html>
    
  )
}
