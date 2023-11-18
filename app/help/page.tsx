"use client";
import Image from "next/image";
import WhiteLogo from "@/static/white-logo.svg";
import HelpPageBackground from "@/static/help/help-page-bg.png";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea";
import KtererFAQ from "@/app/help/kterer_faq.json";
import Link from "next/link";
import React, {useState} from "react";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";

const formSchema = z.object({
    email: z.string().email(),
    subject: z.string().min(10, {
            message: "Subject must be at least 10 characters."
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
    const [searchInput, setSearchInput] = useState("");
    const [searchInitiated, setSearchInitiated] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            subject: "",
            message: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    const handleSearchChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearchInput(e.target.value);
        if (typeof e.target.value === "string") {
            setSearchInitiated(e.target.value.trim() !== '');
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
            text.substring(index + searchText.length)
        ];
    }

    const filteredFAQs = ktererFAQs.filter(faq =>
        faq.question.toLowerCase().includes(searchInput.toLowerCase())
    ).slice(0, 5);

    return (
        <>
            {/* Section 1 */}
            <section className="w-full relative overflow-x-hidden">
                <Image src={HelpPageBackground} className="bg-primary-color w-full h-[30vh] md:h-[40vh] object-cover"
                       alt="hero section food image"/>
                {/* Center Content */}
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <h1 className="text-2xl lg:text-4xl text-white font-bold text-center mb-4 md:mb-8">Got Any
                        Questions?</h1>
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
                        <section id="search-results" className="mt-8 max-w-3xl mx-auto space-y-8">
                            <div className="space-y-4 text-center">
                                <h1 className="font-bold text-xl">Search Results</h1>
                                <ul className="space-y-2">
                                    {filteredFAQs.map((faq) => {
                                        const [before, highlight, after] = highlightSearchText(faq.question, searchInput);
                                        return (
                                            <li key={faq.id}>
                                                <Link href={`/help/${faq.id}?faq_type=kterer`}>
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
                                <h1 className="font-bold text-xl flex items-center">Welcome to Kterings Help</h1>
                                <p>What can we help you with you today?</p>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section id="faqs" className="mt-8 max-w-3xl mx-auto space-y-8 py-16">
                            <div className="grid grid-cols-1 sm:grid-cols-2 space-y-8 sm:space-y-0 text-center">
                                <div>
                                    <h1 className="font-bold text-xl mb-4">Customer Support</h1>
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
                    <section id="submit-ticket" className="mt-8 max-w-3xl mx-auto space-y-8">
                        <div className="space-y-4 text-center">
                            <h1 className="font-bold text-xl">Couldn't Find What You Were Looking
                                For?</h1>
                            <p>Submit a Ticket Here?</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Email" className="rounded-xl"
                                                       type="email" {...field} />
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
                                                <Input placeholder="Subject/Question"
                                                       className="rounded-xl" {...field} />
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
                                                    className="resize-none h-72 rounded-xl"
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
                                        type="submit">Submit Ticket</Button>
                                </div>
                            </form>
                        </Form>
                    </section>
                </div>
            </div>
        </>
    )
}
