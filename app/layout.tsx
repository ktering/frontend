import type {Metadata} from 'next'
import Footer from '@/components/footer'
import {Inter} from 'next/font/google'
import {ClerkProvider} from '@clerk/nextjs'
import './globals.css'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Kterings - Get homemade food wherever and whenever you want',
    description: 'Get homemade food wherever and whenever you want',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
            <body className={inter.className}>
            {children}
            <Footer/>
            </body>
            </html>
        </ClerkProvider>
    )
}
