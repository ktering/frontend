import React from "react";
import type {Metadata} from 'next'
import UserNavbar from "@/components/userNavbar";
import KtererDashboardNavbar from "@/components/ktererDashboardNavbar";
import {currentUser} from '@clerk/nextjs';
import {SearchProvider} from "@/app/context/searchProvider";

export const metadata: Metadata = {
    title: 'Kterings',
    description: 'Kterings Homepage',
}

export default async function KteringsLayout({children}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();
    if (!user) {
        return null;
    }
    const isKterer = user?.publicMetadata?.ktererSignUpCompleted === true;

    return (
        <section>
            <SearchProvider>
                <div>
                    <UserNavbar/>
                    {isKterer ? <KtererDashboardNavbar/> : null}
                    {children}
                </div>
            </SearchProvider>
        </section>
    );
}
