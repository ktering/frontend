import type {Metadata} from 'next'

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
                {children}
            </div>
        </section>
    );
}