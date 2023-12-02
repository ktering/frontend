import React from "react";
import type {Metadata} from 'next'
import KtererDashboardNavbar from "@/components/ktererDashboardNavbar";
import UserNavbar from "@/components/userNavbar";
import {CartProvider} from "@/components/cartContext";

export const metadata: Metadata = {
    title: 'Kterer Dashboard',
    description: 'Kterer Dashboard and Pages',
}

export default function KtererLayout({children}: {
    children: React.ReactNode
}) {

    return (
        <section>
            <CartProvider>
                <UserNavbar/>
                <KtererDashboardNavbar/>
                {children}
            </CartProvider>
        </section>
    )
}
