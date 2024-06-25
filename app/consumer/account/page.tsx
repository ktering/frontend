"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast"
import { useClerk } from "@clerk/nextjs";
import { UserInfo } from "@/types/shared/user";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
    first_name: z.string().min(2, "First name must be at least 2 characters").max(20, "First name can't be longer than 20 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters").max(20, "Last name can't be longer than 20 characters"),
    email: z.string().email(),
    phone: z.string()
        .refine(
            value => /^\+1\d{10}$/.test(value),
            {
                message: "Phone number must start with +1 and be followed by exactly 10 digits",
                path: []
            }
        ),
    country: z.string(),
    email_notification: z.boolean(),
})

export default function ConsumerAccount() {
    const { user, signOut, } = useClerk();
    const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [signOutOfOtherSessions, setSignOutOfOtherSessions] = useState(true);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [updateError, setUpdateError] = useState("");

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            country: "",
            email_notification: false,
        }
    });

    useEffect(() => {
        const getConsumerAccountInfo = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const apiURL = process.env.NEXT_PUBLIC_API_URL;

            try {
                const response = await fetch(`${apiURL}/api/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                });

                if (!response.ok) {
                    console.error(`Error: ${response.statusText}`);
                    return;
                }

                const data = await response.json();
                setUserInfo(data.user);
            } catch (error) {
                console.error(error);
            }
        }

        getConsumerAccountInfo().catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if (userInfo) {
            const { first_name, last_name, email, phone, country, email_notification } = userInfo;
            form.setValue("first_name", first_name || "");
            form.setValue("last_name", last_name || "");
            form.setValue("email", email || "");
            form.setValue("phone", phone || "");
            form.setValue("country", country || "");
            form.setValue("email_notification", email_notification || false);
        }
    }, [userInfo, form]);

    useEffect(() => {
        if (!isPasswordResetOpen) {
            setUpdateError("");
            setCurrentPassword("");
            setNewPassword("");
        }
    }, [isPasswordResetOpen]);

    const deleteAccount = async () => {
        // TODO: We should use a transaction here to delete the user from the db and Clerk. Dont have time to implement this now.
        if (!userInfo || !userInfo.client_id) {
            console.error('User info or Client ID missing');
            return;
        }

        try {
            // First, delete the user from the database
            const accessToken = localStorage.getItem('accessToken');
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            const dbResponse = await fetch(`${apiURL}/api/user`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (!dbResponse.ok) {
                console.error(`Error: ${dbResponse.statusText}`);
                return;
            }

            // Now, if the db deletion was successful, delete the user from Clerk
            const clerkResponse = await fetch(`/api/consumer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userInfo.client_id }),
            });

            if (!clerkResponse.ok) {
                console.error(`Error: ${clerkResponse.statusText}`);
                return;
            }

            const clerkData = await clerkResponse.json();

            if (clerkData.success) {
                try {
                    await signOut();
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('cart');
                    router.push('/');
                } catch (error) {
                    console.error('Failed to sign out');
                }
            } else {
                console.error('Failed to delete account');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const accessToken = localStorage.getItem('accessToken');
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiURL}/api/user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(values),
        });
        if (response.ok) {
            toast({
                description: (
                    <>
                        <div className="flex items-center">
                            <CheckCircleIcon
                                className="w-6 h-6 inline-block align-text-bottom mr-2 text-green-400" />
                            Account Info Successfully Updated!
                        </div>
                    </>
                )
            });
        } else {
            console.error(`Error: ${response.statusText}`);
        }
    }

    const handlePasswordUpdate = async () => {
        try {
            await user?.updatePassword({
                newPassword: newPassword,
                currentPassword: currentPassword,
                signOutOfOtherSessions: signOutOfOtherSessions,
            });
            setUpdateSuccess(true);
            setUpdateError("");
        } catch (error) {
            console.error('Error updating password:', error);
            const errorMessage = "Error! Please check your current and new passwords or have a strong new password.";
            setUpdateError(errorMessage);
        }
    };

    const handleInputPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        event.target.value = value.replace(/[^\d+]/g, ''); // Solo permite dígitos y el símbolo +
    };

    return (
        <>
            <div className="flex justify-between my-8">
                <div className="text-2xl font-bold ">Account</div>
                <button
                    onClick={() => setIsPasswordResetOpen(true)}
                    className="rounded-full px-4 py-2.5 font-semibold border text-primary-color hover:bg-gray-50 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color">
                    Change Password
                </button>
            </div>
            <div className="max-w-2xl mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="my-10 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2">
                            <div className="col-span-2 sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input className="rounded-full" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <FormField
                                    control={form.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input className="rounded-full" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input disabled className="rounded-full" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-2">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input 
                                                className="rounded-full" 
                                                {...field} 
                                                onInput={handleInputPhone}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-2">
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country</FormLabel>
                                            <FormControl>
                                                <Input className="rounded-full" disabled {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="col-span-2">
                                <FormField
                                    control={form.control}
                                    name="email_notification"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="mt-4">Email Notification</FormLabel>
                                            <FormControl>
                                                <Switch className="rounded-full" checked={field.value} onCheckedChange={(checked) => field.onChange(checked)} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit"
                                className="col-span-2 bg-primary-color w-full sm:w-auto hover:bg-primary-color-hover rounded-full">Save</Button>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="flex flex-col my-16 max-w-xs w-full mx-auto items-center">
                <button
                    onClick={async () => {
                        try {
                            const accessToken = localStorage.getItem("accessToken");
                            const apiURL = process.env.NEXT_PUBLIC_API_URL;

                            const response = await fetch(`${apiURL}/api/convert-to-kterer`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${accessToken}`
                                }
                            });

                            if (response.status === 200) {
                                let userId = user?.id;
                                const response = await fetch('/api/kterer', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ userId, ktererSignUpCompleted: false }),
                                });

                                if (response.ok) {
                                    router.push('/kterer-onboarding/kterer-setup');
                                }

                            } else {
                                console.error('Failed to convert account to Kterer');
                            }
                        } catch (error) {
                            console.error('An error occurred:', error);
                        }
                    }}
                    className="rounded-full px-4 py-2.5 font-semibold border bg-primary-color text-white hover:bg-primary-color-hover shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                >
                    Become a Kterer
                </button>
                <button
                    onClick={deleteAccount}
                    className="border mt-4 rounded-full px-4 py-2.5 font-semibold text-primary-color hover:bg-gray-50 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color">
                    Delete Account
                </button>
            </div>

            <AlertDialog open={isPasswordResetOpen} onOpenChange={setIsPasswordResetOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change Password</AlertDialogTitle>
                        {!updateSuccess ? (
                            <AlertDialogDescription>
                                Enter your current and new password.
                            </AlertDialogDescription>
                        ) : (
                            <>
                                <AlertDialogDescription>
                                    Your password has been updated successfully.
                                </AlertDialogDescription>
                                <AlertDialogCancel>Close</AlertDialogCancel>
                            </>
                        )}
                    </AlertDialogHeader>
                    {!updateSuccess && (
                        <AlertDialogFooter>
                            <div className="flex flex-col w-full space-y-8">
                                <div className="space-y-4">
                                    <Input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Current Password"
                                    />
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="New Password"
                                    />
                                </div>
                                {updateError && (
                                    <div className="rounded-md bg-red-50 p-4 col-span-6">
                                        <div className="flex">
                                            <div className="ml-2">
                                                <h3 className="text-sm font-medium text-red-800">{updateError}</h3>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="space-x-4">
                                    <Button onClick={handlePasswordUpdate}>Update Password</Button>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                </div>
                            </div>
                        </AlertDialogFooter>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}