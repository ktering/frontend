import React from "react";
import type {Metadata} from 'next'
import KtererDashboardNavbar from "@/components/ktererDashboardNavbar";
import UserNavbar from "@/components/userNavbar";

export const metadata: Metadata = {
    title: 'Kterer Dashboard',
    description: 'Kterer Dashboard and Pages',
}

export default function KtererLayout({children}: {
    children: React.ReactNode
}) {

    return (
        <section>
            <UserNavbar/>
            <KtererDashboardNavbar/>
            {children}
        </section>
    )
}
