import type {Metadata} from 'next'
import KtererNavbar from "@/components/ktererNavbar";

export const metadata: Metadata = {
    title: 'Kterings - About Us',
    description: 'About Kterings - Our Mission, Story and Community',
}

export default function AboutUsLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <section>
            <KtererNavbar/>
            {children}
        </section>
    )
}
