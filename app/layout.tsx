import type {Metadata} from 'next'
import Footer from '@/components/footer'
import {Inter} from 'next/font/google'
import {ClerkProvider} from '@clerk/nextjs'
import './globals.css'
import {Toaster} from "@/components/ui/toaster"

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
        <ClerkProvider
            appearance={{
                elements: {
                    card: 'w-[512px]',
                    formButtonPrimary: 'bg-primary-color hover:bg-primary-color-hover',
                },
            }}
        >
            <html lang="en">
            <body className={inter.className}>
            {children}
            <Toaster/>
            <Footer/>
            </body>
            </html>
        </ClerkProvider>
    )
}
