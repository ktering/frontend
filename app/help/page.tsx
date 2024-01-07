"use client";
import Image from "next/image";
import HelpPageBackground from "@/static/help/help-page-bg.png";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea";
import KtererFAQ from "@/app/help/kterer_faq.json";
import CustomerFAQ from "@/app/help/customer_faq.json";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {CheckCircleIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {FAQ} from "@/types/pages/help/help";
import {toast} from "@/components/ui/use-toast";

const formSchema = z.object({
    email: z.string().email(),
    subject: z.string().min(6, {
            message: "Subject must be at least 6 characters."
        }
    ).max(50, {
        message: "Subject must not be longer than 50 characters.",
    }),
    message: z.string().min(10, {
            message: "Message must be at least 10 characters."
        }
    ).max(1000, {
        message: "Message must not be longer than 1000 characters.",
    }),
})

export default function Help() {
    const ktererFAQs = KtererFAQ.kterer_faqs;
    const customerFAQs = CustomerFAQ.customer_faqs;
    const [searchInput, setSearchInput] = useState("");
    const [searchInitiated, setSearchInitiated] = useState(false);
    const [filteredFAQs, setFilteredFAQs] = useState<FAQ[]>([]);

    useEffect(() => {
        const searchLowerCase = searchInput.toLowerCase();
        const combinedFAQs = [
            ...ktererFAQs.map(faq => ({...faq, id: faq.id.toString(), type: 'kterer'})),
            ...customerFAQs.map(faq => ({...faq, id: faq.id.toString(), type: 'customer'})),
        ];
        const filtered = combinedFAQs.filter((faq) =>
            faq.question.toLowerCase().includes(searchLowerCase),
        );
        setFilteredFAQs(filtered.slice(0, 5));
    }, [searchInput, ktererFAQs, customerFAQs]);

    const handleSearchChange = (e: {
        target: { value: React.SetStateAction<string> };
    }) => {
        setSearchInput(e.target.value);
        if (typeof e.target.value === "string") {
            setSearchInitiated(e.target.value.trim() !== "");
        }
    };

    const highlightSearchText = (text: string, searchText: string) => {
        const index = text.toLowerCase().indexOf(searchText.toLowerCase());
        if (index === -1) {
            return [text];
        }

        return [
            text.substring(0, index),
            text.substring(index, index + searchText.length),
            text.substring(index + searchText.length),
        ];
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            subject: "",
            message: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const accessToken = localStorage.getItem("accessToken");
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiURL}/api/support`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
            return;
        }

        form.reset();
        toast({
            description: (
                <>
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-6 h-6 inline-block align-text-bottom mr-2 text-green-400"/>
                        Support ticket submitted successfully. We will get back to you as
                        soon as possible.
                    </div>
                </>
            ),
            duration: 5000,
        });
    }

    return (
        <>
            {/* Section 1 */}
            <section className="w-full relative overflow-x-hidden transition-all duration-700 ease-in-out">
                {/* Background Image */}
                <div
                    className={`transition-all duration-700 ease-in-out ${
                        searchInitiated
                            ? "h-28 opacity-0"
                            : "h-[25vh] opacity-1"
                    }`}
                >
                    <Image
                        src={HelpPageBackground}
                        className="bg-primary-color w-full h-full object-cover"
                        alt="help page hero image"
                    />
                </div>

                {/* Center Content */}
                <div
                    className={`absolute ${
                        searchInitiated ? "top-4  pt-12" : "top-1/3"
                    } left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-in-out`}
                >
                    {!searchInitiated && (
                        <h1 className="text-2xl lg:text-4xl text-white font-bold text-center mb-4 md:mb-8">
                            Got any questions?
                        </h1>
                    )}
                    {/* Search bar */}
                    <div className="relative w-96">
                        {/* Icon */}
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="w-5 h-5"/>
                        </div>
                        {/* Input */}
                        <Input
                            type="text"
                            className="rounded-full pl-10 pr-3 py-2"
                            placeholder="Ask away..."
                            value={searchInput}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {searchInput.trim() ? (
                    filteredFAQs.length > 0 ? (
                        <section
                            id="search-results"
                            className="mt-8 max-w-3xl mx-auto space-y-8"
                        >
                            <div className="space-y-4 text-center">
                                <h1 className="font-bold text-xl">Search Results</h1>
                                <ul className="space-y-2">
                                    {filteredFAQs.map((faq) => {
                                        const [before, highlight, after] = highlightSearchText(
                                            faq.question,
                                            searchInput,
                                        );
                                        return (
                                            <li key={faq.id}>
                                                <Link href={`/help/${faq.id}?faq_type=${faq.type}`}>
                                                    <p className="hover:text-primary-color">
                                                        {before}
                                                        <span className="bg-yellow-200">{highlight}</span>
                                                        {after}
                                                    </p>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </section>
                    ) : (
                        <div className="mt-8 max-w-3xl mx-auto text-center space-y-4">
                            <h1 className="font-bold text-xl">No Results Found</h1>
                            <p>Try a different search term or submit a ticket below.</p>
                        </div>
                    )
                ) : (
                    <>
                        {/* Section 2 */}
                        <section>
                            <div className="space-y-4 flex flex-col items-center sm:items-start">
                                <h1 className="font-bold text-xl flex items-center">
                                    Welcome to Kterings Help
                                </h1>
                                <p>What can we help you with you today?</p>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section
                            id="faqs"
                            className="mt-8 max-w-3xl mx-auto space-y-8 py-16"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 space-y-8 sm:space-y-0 text-center">
                                <div>
                                    <h1 className="font-bold text-xl mb-4">Customer Support</h1>
                                    <ul className="space-y-2">
                                        {customerFAQs.slice(0, 5).map((faq) => (
                                            <li key={faq.id}>
                                                <Link href={`/help/${faq.id}?faq_type=customer`}>
                                                    <p className="hover:text-primary-color">
                                                        {faq.question}
                                                    </p>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h1 className="font-bold text-xl mb-4">Kterer Support</h1>
                                    <ul className="space-y-2">
                                        {ktererFAQs.slice(0, 5).map((faq) => (
                                            <li key={faq.id}>
                                                <Link href={`/help/${faq.id}?faq_type=kterer`}>
                                                    <p className="hover:text-primary-color">
                                                        {faq.question}
                                                    </p>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <section
                        id="submit-ticket"
                        className="mt-8 max-w-3xl mx-auto space-y-8"
                    >
                        <div className="space-y-4 text-center">
                            <h1 className="font-bold text-xl">
                                Couldn't Find What You Were Looking For?
                            </h1>
                            <p>Submit a Ticket Here</p>
                        </div>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Email"
                                                    className="rounded-xl border-2"
                                                    type="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Subject/Question"
                                                    className="rounded-xl border-2"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Description"
                                                    className="resize-none h-72 rounded-xl border-2"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className="text-center">
                                    <Button
                                        className="bg-primary-color hover:bg-primary-color-hover text-white rounded-full"
                                        type="submit"
                                    >
                                        Submit Ticket
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </section>
                </div>
            </div>
        </>
    );
}