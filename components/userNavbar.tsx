"use client";
import {Disclosure} from "@headlessui/react";
import Logo from "@/static/red-logo.svg"
import Image from "next/image";
import Link from "next/link";

export default function UserNavbar() {
    return (
        <Disclosure as="nav" className="bg-white shadow-sm">
            {({open}) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-24 justify-between">
                            <div className="flex">
                                <div className="flex flex-shrink-0 items-center">
                                    <Link href="/">
                                        <Image
                                            className="h-16 w-auto"
                                            src={Logo}
                                            alt="Kterings Logo"
                                        />
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <button
                                        type="button"
                                        className="text-sm md:text-base rounded-full bg-primary-color px-3 md:px-4 py-2 font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        type="button"
                                        className="text-sm md:text-base rounded-full bg-white px-3 md:px-4 py-2 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    )
}