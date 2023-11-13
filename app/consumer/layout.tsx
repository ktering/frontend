import React from "react";
import type {Metadata} from 'next'
import UserNavbar from "@/components/userNavbar";

export const metadata: Metadata = {
    title: 'Kterings | Profile',
    description: 'Kterings Profile Page',
}

export default function ConsumerLayout({children}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <UserNavbar/>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </section>
    );
}
