"use client";
import React, {useEffect} from "react";
import KtererFAQ from "@/app/help/kterer_faq.json";
import CustomerFAQ from "@/app/help/customer_faq.json";
import {Button} from "@/components/ui/button";
import {useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";
import {ArrowLeftIcon} from "@heroicons/react/20/solid";

export default function HelpQuestion({params}: { params: { id: string } }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const faqType = searchParams.get('faq_type');
    const faqId = params.id;

    const faqData = faqType === 'kterer' ? KtererFAQ.kterer_faqs : CustomerFAQ.customer_faqs;
    const faq = faqData.find(faq => faq.id.toString() === faqId);

    const answer = faq?.answer || '';
    const formattedText = answer?.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <p className="font-bold text-xl mb-12 flex items-center">
                    <Link href="/help" className="flex spcae-x-4">
                        <ArrowLeftIcon className="h-6 w-6 text-primary-color mr-2"/>
                        Help Page
                    </Link>
                </p>
                <h1 className="font-bold text-xl flex items-center">{faq.question}</h1>
                <p className="max-w-3xl mx-auto py-16" dangerouslySetInnerHTML={{__html: formattedText}}></p>
                <div className="text-center">
                    <Button
                        className="bg-primary-color hover:bg-primary-color-hover text-white rounded-full"
                        type="submit" onClick={handleNeedHelpClick}>Still Need Help?</Button>
                </div>
            </div>
        </>
    )
}
