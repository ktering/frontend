"use client";
import {useEffect} from "react";
import KtererFAQ from "@/app/help/kterer_faq.json";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function HelpQuestion({params}: { params: { id: string } }) {
    const router = useRouter();
    const faqId = params.id;

    const faq = KtererFAQ.kterer_faqs.find(faq => faq.id.toString() === faqId);

    useEffect(() => {
        if (!faq) {
            const timer = setTimeout(() => {
                router.push("/help#faqs");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [faq, router]);

    if (!faq) {
        return <p className="max-w-7xl mx-auto text-lg text-center py-12 text-destructive">FAQ not found.
            Redirecting...</p>;
    }

    const handleNeedHelpClick = () => {
        router.push("/help#submit-ticket");
    }

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
                <h1 className="font-bold text-xl flex items-center">{faq.question}</h1>
                <p className="max-w-3xl mx-auto">{faq.answer}</p>
                <div className="text-center">
                    <Button
                        className="bg-primary-color hover:bg-primary-color-hover text-white rounded-full"
                        type="submit" onClick={handleNeedHelpClick}>Still Need Help?</Button>
                </div>
            </div>
        </>
    )
}
