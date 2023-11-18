import React from "react";
import type {Metadata} from 'next'
import KtererNavbar from "@/components/ktererNavbar";

export const metadata: Metadata = {
    title: 'Kterer Onboarding',
    description: 'Become a Kterer, fill out the form, and start selling',
}

export default function KtererOnboardingLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <section>
            <KtererNavbar/>
            {children}
        </section>
    )
}
