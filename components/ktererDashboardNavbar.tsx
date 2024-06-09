"use client";

import Link from "next/link";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function KtererDashboardNavbar() {
    const router = useRouter();
    const buttons = [
        {name: "Help", href: "/help"},
        {name: "Dashboard", href: "/kterer/dashboard"},
        {name: "Earnings", href: "/kterer/earnings"},
        {name: "Post Food", href: "/kterer/post"},
    ];

    const [isAdminVerified, setIsAdminVerified] = useState<number>(0);

    const getKtererAccountInfo = async () => {
        const accessToken = localStorage.getItem("accessToken");
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${apiURL}/api/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                console.error(`Error: ${response.statusText}`);
                return;
            }

            const data = await response.json();
            setIsAdminVerified(data.user.kterer.admin_verified);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    useEffect(() => {
        getKtererAccountInfo();
    }, []);


    if (isAdminVerified !== 1) {
        router.push("/kterer-onboarding/wait-for-confirmation");
    }

    return (
        <div className="border-b border-gray-200 bg-primary-color">
            <div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center sm:justify-between justify-end">
                <h3 className="hidden sm:block text-base font-semibold leading-6 text-white">
                    Kterer Menu
                </h3>
                <div className="flex sm:ml-4 sm:mt-0">
                    {buttons.map((button, index) => (
                        <Link key={index} href={button.href}>
                            <div
                                className={`ml-3 inline-flex items-center text-sm rounded-full px-3 md:px-4 py-2 font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color ${
                                    button.name === "Post Food"
                                        ? "bg-black shadow-black text-white hover:bg-slate-800 whitespace-nowrap"
                                        : button.name === "Help"
                                            ? "text-white hover:text-gray-50 hidden sm:block"
                                            : "bg-white shadow-black text-primary-color hover:bg-gray-200"
                                }`}
                            >
                                {button.name}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
