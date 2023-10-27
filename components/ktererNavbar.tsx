"use client";
import {Disclosure} from "@headlessui/react";
import {Bars3Icon, MagnifyingGlassIcon, XMarkIcon} from '@heroicons/react/24/outline'
import Logo from "@/static/red-logo.svg"
import Image from "next/image";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {UserButton, useUser} from "@clerk/nextjs";

const navigation = [
    {name: "Help", href: "/"},
    {name: "About Us", href: "/about-us"},
    {name: "Become a Kterer", href: "/become-a-kterer"},
];

export default function KtererNavbar() {
    const {isSignedIn} = useUser();
    const pathname = usePathname();
    const isLegalRoute = pathname.startsWith('/legal');

    return (
        <Disclosure as="nav" className="bg-white shadow-sm">
            {({open}) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-24 justify-between">
                            <div className="flex">
                                <div className="-ml-2 mr-2 flex items-center md:hidden">
                                    {/* Mobile menu button */}
                                    {!isLegalRoute && (
                                        <Disclosure.Button
                                            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                            <span className="absolute -inset-0.5"/>
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XMarkIcon className="block h-6 w-6" aria-hidden="true"/>
                                            ) : (
                                                <Bars3Icon className="block h-6 w-6" aria-hidden="true"/>
                                            )}
                                        </Disclosure.Button>
                                    )}
                                </div>
                                <div className="flex flex-shrink-0 items-center">
                                    <Link href="/">
                                        <Image
                                            className="h-16 w-auto"
                                            src={Logo}
                                            alt="Kterings Logo"
                                        />
                                    </Link>
                                </div>
                                {!isLegalRoute && (
                                    <div className="hidden md:ml-12 md:flex md:space-x-8">
                                        {
                                            navigation.map(navItem => (
                                                <a
                                                    key={navItem.href}
                                                    href={navItem.href}
                                                    className={`inline-flex items-center px-1 pt-1 font-medium ${pathname === navItem.href ? "text-primary-color" : "text-gray-500 hover:text-gray-700"}`}
                                                >
                                                    {navItem.name}
                                                </a>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center">
                                {!isLegalRoute && (
                                    <div className="hidden md:mr-4 md:flex md:flex-shrink-0 md:items-center">
                                        <button
                                            type="button"
                                            className="relative rounded-full bg-white p-1 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            <span className="absolute -inset-1.5"/>
                                            <span className="sr-only">Search Help</span>
                                            <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true"/>
                                        </button>
                                    </div>
                                )}
                                <div className="flex-shrink-0">
                                    {isSignedIn ? <UserButton afterSignOutUrl="/"/> : (
                                        <button
                                            type="button"
                                            className="rounded-full bg-primary-color px-3.5 py-2 font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Get Started
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {!isLegalRoute && (
                        <Disclosure.Panel className="md:hidden">
                            <div className="space-y-1 pb-3 pt-2">
                                {navigation.map(navItem => (
                                    <Disclosure.Button
                                        key={navItem.href}
                                        as="a"
                                        href={navItem.href}
                                        className={`block py-2 pl-3 pr-4 font-medium ${pathname === navItem.href ? "text-primary-color" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        {navItem.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    )}
                </>
            )}
        </Disclosure>
    )
}