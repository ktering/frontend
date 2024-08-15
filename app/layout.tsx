import React from "react";
import type { Metadata } from "next";
import Footer from "@/components/footer";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { StatusContextProvider } from "@/contexts/StatusProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kterings - Get homemade food wherever and whenever you want",
  description: "Get homemade food wherever and whenever you want",

  // To get the logo showing when the link is shared
  // openGraph: {
  //     title: 'Kterings - Get homemade food wherever and whenever you want',
  //     description: 'Get homemade food wherever and whenever you want',
  //     url: 'https://kterings.com',
  //     siteName: 'Kterings',
  //     images: [
  //         {
  //             url: 'http://localhost:3000/red-logo.svg',
  //             width: 800,
  //             height: 800,
  //         },
  //     ],
  //     locale: 'en_US',
  //     type: 'website',
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          card: "w-[512px]",
          formButtonPrimary: "bg-primary-color hover:bg-primary-color-hover",
        },
      }}
    >
      <html lang="en">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <AuthProvider>
            <StatusContextProvider>
              {/* Main container for content */}
              <main className="flex-grow">{children}</main>
            </StatusContextProvider>
          </AuthProvider>
          <Toaster />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
