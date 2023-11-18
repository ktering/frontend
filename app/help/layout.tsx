import React from "react";
import type {Metadata} from 'next'
import KtererNavbar from "@/components/ktererNavbar";

export const metadata: Metadata = {
    title: 'Help',
    description: "Get help with Kterings and Kterer",
}

export default function HelpLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <section>
            <KtererNavbar/>
            {children}
        </section>
    )
}
