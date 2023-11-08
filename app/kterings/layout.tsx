import type {Metadata} from 'next'
import UserNavbar from "@/components/userNavbar";
import KtererDashboardNavbar from "@/components/ktererDashboardNavbar";
import {currentUser} from '@clerk/nextjs';

export const metadata: Metadata = {
    title: 'Ktering',
    description: 'Ktering Homepage',
}

export default async function KteringLayout({children}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();
    if (!user) {
        return null;
    }
    const isKterer = user?.publicMetadata?.ktererSignUpCompleted === true;

    return (
        <section>
            <div>
                <UserNavbar/>
                {isKterer ? <KtererDashboardNavbar/> : null}
                {children}
            </div>
        </section>
    );
}
