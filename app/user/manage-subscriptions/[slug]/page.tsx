"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { KtererInfo } from "@/types/shared/user";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import bcrypt from 'bcryptjs';
import { AlertTitle } from "@/components/ui/alert";


const formSchema = z.object({
    email_notification: z.boolean(),
});

export default function KtererAccount({ params }: { params: { slug: string } }) {

    const [ktererInfo, setKtererInfo] = useState<KtererInfo | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email_notification: false,
        },
    });

    useEffect(() => {
        const getKtererAccountInfo = async () => {
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const response = await fetch(`${apiURL}/api/user/affiliate`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ affiliate_link: params.slug }),
                });

                if (!response.ok) {
                    console.error(`Error: ${response.statusText}`);
                    router.replace('/');
                    return;
                }

                const data = await response.json();
                setKtererInfo(data.user);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        getKtererAccountInfo().catch((error) => {
            console.error("An error occurred:", error);
        });
    }, []);

    useEffect(() => {
        if (ktererInfo) {
            let {
                email_notification = false,
            } = ktererInfo;

            email_notification = Boolean(email_notification);

            const formValues = {
                email_notification,
            };

            (Object.keys(formValues) as Array<keyof typeof formValues>).forEach(
                (key) => {
                    form.setValue(key, formValues[key], { shouldValidate: true });
                }
            );
        }

    }, [ktererInfo, form]);

    const handleEmailSubscribeChange = (status: boolean) => {
        const changeSubscriptionStatus = async () => {
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const response = await fetch(`${apiURL}/api/user/subscription`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: status, affiliate_link: params.slug }),
                });

                if (!response.ok) {
                    console.error(`Error: ${response.statusText}`);
                    return;
                }

                const data = await response.json();
                setKtererInfo(data.user);

                toast({
                    description: (
                        <>
                            <div className="flex items-center">
                                <CheckCircleIcon
                                    className="w-6 h-6 inline-block align-text-bottom mr-2 text-green-400" />
                                Subscription Status Successfully Updated!
                            </div>
                        </>
                    )
                });
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        changeSubscriptionStatus().catch((error) => {
            console.error("An error occurred:", error);
        });
    };

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <Form {...form}>
                        <form className="space-y-8" id="kterer_acount_form">
                            <div className="my-10 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2">

                                <div className="col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="email_notification"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mt-4">Email Notification</FormLabel>
                                                <FormControl>
                                                    <Switch className="rounded-full" checked={field.value} onCheckedChange={(checked) => { field.onChange(checked); handleEmailSubscribeChange(checked); }} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    );
}
