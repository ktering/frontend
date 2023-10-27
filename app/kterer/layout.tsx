import type {Metadata} from 'next'
import KtererNavbar from "@/components/ktererNavbar";

export const metadata: Metadata = {
    title: 'Kterer Dashboard',
    description: 'Kterer Dashboard and Pages',
}

export default function KtererLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <section>
            <KtererNavbar/>
            {children}
        </section>
    )
}
