import React from "react";
import type {Metadata} from 'next'
import KtererNavbar from "@/components/ktererNavbar";

export const metadata: Metadata = {
    title: 'Kterings - Become a Kterer',
    description: 'Become a Kterer, Make what you want, Reach more people, Sell More',
}

export default function BecomeKterer({children}: {
    children: React.ReactNode
}) {
    return (
        <section>
            <KtererNavbar/>
            {children}
        </section>
    )
}
