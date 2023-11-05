import type {Metadata} from 'next'
import UserNavbar from "@/components/userNavbar";

export const metadata: Metadata = {
    title: 'Ktering',
    description: 'Ktering Homepage',
}

export default function KteringLayout({children}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <div>
                <UserNavbar/>
                {children}
            </div>
        </section>
    );
}
