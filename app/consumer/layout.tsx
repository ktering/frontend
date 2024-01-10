import React from "react";
import type {Metadata} from "next";
import UserNavbar from "@/components/userNavbar";
import {CartProvider} from "@/components/cartContext";
import {NotificationProvider} from "@/components/notificationContext";
import {currentUser} from "@clerk/nextjs";
import KtererDashboardNavbar from "@/components/ktererDashboardNavbar";

export const metadata: Metadata = {
    title: "Kterings | Profile",
    description: "Kterings Profile Page",
};

export default async function ConsumerLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    const user = await currentUser();
    if (!user) {
        return null;
    }
    const isKterer = user?.publicMetadata?.ktererSignUpCompleted === true;

    return (
        <CartProvider>
            <NotificationProvider>
                <div>
                    <UserNavbar/>
                    {isKterer ? <KtererDashboardNavbar/> : null}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </div>
            </NotificationProvider>
        </CartProvider>
    );
}
