import React from "react";
import type {Metadata} from 'next'
import KtererNavbar from "@/components/ktererNavbar";
import {currentUser} from '@clerk/nextjs';
import KtererDashboardNavbar from "@/components/ktererDashboardNavbar";

export const metadata: Metadata = {
    title: 'Help',
    description: "Get help with Kterings and Kterer",
}

export default async function HelpLayout({children}: {
    children: React.ReactNode
}) {
    // const user = await currentUser();
    // if (!user) {
    //     return null;
    // }
    // const isKterer = user?.publicMetadata?.ktererSignUpCompleted === true;

    return (
        <section>
            <KtererNavbar/>
            {/*{isKterer ? <KtererDashboardNavbar/> : null}*/}
            {children}
        </section>
    )
}
