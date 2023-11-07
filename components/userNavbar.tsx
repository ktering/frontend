"use client";
import {useEffect, useState} from "react";
import {
    ArrowLeftOnRectangleIcon,
    BellIcon,
    HeartIcon,
    HomeIcon,
    QuestionMarkCircleIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline'
import Logo from "@/static/red-logo.svg"
import Image from "next/image";
import Link from "next/link";
import {Sheet, SheetContent, SheetTrigger,} from "@/components/ui/sheet"
import {useClerk} from "@clerk/clerk-react";
import {useRouter} from 'next/navigation'
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button";

export default function UserNavbar() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const {signOut, user} = useClerk();
    const router = useRouter();
    const isKterer = user?.publicMetadata?.ktererSignUpCompleted === true;

    const toggleSideBar = () => {
        setIsSideBarOpen(!isSideBarOpen);
    }

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    }

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    const USER_SIDEBAR_ITEMS = [
        {name: "Home", icon: <HomeIcon className="h-6 w-6"/>, href: "/kterings"},
        {name: "Orders", icon: <ShoppingBagIcon className="h-6 w-6"/>, href: "/kterings"},
        {
            name: "Account",
            icon: <UserCircleIcon className="h-6 w-6"/>,
            href: isKterer ? "/kterer/account" : "/consumer/account"
        },
        {name: "Saved Kterers", icon: <HeartIcon className="h-6 w-6"/>, href: "/kterings"},
        {name: "Help", icon: <QuestionMarkCircleIcon className="h-6 w-6"/>, href: "/kterings"},
        {name: "Sign Out", icon: <ArrowLeftOnRectangleIcon className="h-6 w-6"/>, href: "/kterings"},
    ];

    const signOutF = () => {
        signOut()
            .then(() => {
                localStorage.removeItem('accessToken');
                router.push('/');
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            <div className="border-b">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-24 justify-between">
                        <div className="flex items-center">
                            {/* Hamburger Menu Button */}
                            <Sheet>
                                <SheetTrigger onClick={toggleSideBar}>
                                    <div
                                        className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-color md:mr-4">
                                        <span className="absolute -inset-0.5"/>
                                        <span className="sr-only">Open menu</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                             className="w-6 h-6">
                                            <path fillRule="evenodd"
                                                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                </SheetTrigger>
                            </Sheet>

                            {/* Logo */}
                            <div className="flex flex-shrink-0 items-center">
                                <Link href="/">
                                    <Image
                                        className="h-16 w-auto"
                                        src={Logo}
                                        alt="Kterings Logo"
                                    />
                                </Link>
                            </div>

                            {/* Buttons */}
                            <div className="flex ml-8">
                                <Button
                                    className="border rounded-full bg-white hover:bg-gray-50 px-4 py-2.5 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color">Pickup</Button>
                                <Button
                                    className="border rounded-full bg-white hover:bg-gray-50 px-4 py-2.5 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                                >Delivery</Button>
                            </div>

                        </div>
                        <div className="flex items-center">
                            {/* Search bar */}
                            <div className="relative w-80 mr-4">
                                {/* Icon */}
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                                    </svg>
                                </div>
                                {/* Input */}
                                <Input type="text" className="rounded-full pl-10 pr-3 py-2"
                                       placeholder="Search Kterers, Dishes"/>
                            </div>

                            {/* Notification Icon */}
                            <div className="md:mr-4 md:flex md:flex-shrink-0 md:items-center">
                                <button
                                    type="button"
                                    className="relative mr-2 rounded-full bg-white p-1 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-offset-2"
                                >
                                    <span className="absolute -inset-1.5"/>
                                    <span className="sr-only">Check Notifications</span>
                                    <BellIcon className="h-6 w-6" aria-hidden="true"/>
                                </button>
                                {/* Cart Button */}
                                <Sheet>
                                    <SheetTrigger onClick={toggleCart}>
                                        <div
                                            className="relative rounded-full bg-white p-1 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-offset-2"
                                        >
                                            <span className="absolute -inset-1.5"/>
                                            <span className="sr-only">Check Shopping Cart</span>
                                            <ShoppingCartIcon className="h-6 w-6" aria-hidden="true"/>
                                        </div>
                                    </SheetTrigger>
                                </Sheet>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Sidebar Component */}
            <Sheet open={isSideBarOpen} onOpenChange={setIsSideBarOpen}>
                <SheetContent side="left">
                    <div className="py-8 space-y-8">
                        {USER_SIDEBAR_ITEMS.map((item) => (
                            <Link key={item.name} href={item.href}>
                                <div className="flex items-center space-x-5 hover:bg-gray-100 rounded py-4 border-b"
                                     onClick={item.name === "Sign Out" ? signOutF : toggleSideBar}
                                >
                                    {item.icon}
                                    <span className="font-bold">{item.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
            {/* Cart Component */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetContent side="right">
                    <div className="text-center border-b pb-4">
                        <div className="pb-4 text-2xl font-bold text-center space-y-8">
                            Your Cart
                        </div>
                        <button
                            className="rounded-full bg-primary-color px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                        >Checkout
                        </button>
                    </div>

                    <ul role="list" className="divide-y divide-gray-200">
                        {cartItems.map((item) => (
                            <li key={item.id} className="py-4 space-y-2 border-b">
                                <div>{item.name}</div>
                                <div className="text-sm">{item.size}</div>
                                <div className="font-bold">${item.price}</div>
                            </li>
                        ))}
                    </ul>
                </SheetContent>
            </Sheet>
        </>
    )
}
