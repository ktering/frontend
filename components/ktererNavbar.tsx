"use client";
import {Dialog, Disclosure, Transition} from "@headlessui/react";
import {Bars3Icon, MagnifyingGlassIcon, XMarkIcon} from '@heroicons/react/24/outline'
import Logo from "@/static/red-logo.svg"
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import {useClerk, useUser} from "@clerk/nextjs";
import {Fragment, useRef, useState} from "react";
import SignUpForm from "@/app/sign-up/[[...sign-up]].page";

const navigation = [
    {name: "Help", href: "/help"},
    {name: "About Us", href: "/about-us"},
    {name: "Become a Kterer", href: "/become-a-kterer"},
];

export default function KtererNavbar() {
    const {isSignedIn, user} = useUser();
    const {openSignUp} = useClerk();
    const router = useRouter();
    const pathname = usePathname();
    const [showKtererSignUp, setShowKtererSignUp] = useState(false);
    const cancelButtonRef = useRef(null);

    const handleGetStarted = () => {
        if (isSignedIn) {
            if (user?.publicMetadata?.ktererSignUpCompleted === true) {
                router.push('/kterer/dashboard');
            } else {
                router.push('/kterings');
            }
        } else {
            if (pathname === '/become-a-kterer') {
                setShowKtererSignUp(true);
            } else {
                openSignUp();
            }
        }
    };

    return (
        <Disclosure as="nav" className="bg-white shadow-sm">
            {({open}) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-24 justify-between">
                            <div className="flex">
                                <div className="-ml-2 mr-2 flex items-center md:hidden">
                                    {/* Mobile menu button */}
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
                                <div className="hidden md:ml-12 md:flex md:space-x-8">
                                    {
                                        navigation.map(navItem => (
                                            <Link
                                                key={navItem.href}
                                                href={navItem.href}
                                                className={`inline-flex items-center px-1 pt-1 font-medium ${pathname === navItem.href ? "text-primary-color" : "text-gray-500 hover:text-gray-700"}`}
                                            >
                                                {navItem.name}
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="flex items-center">
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
                                <div className="flex-shrink-0">
                                    {showKtererSignUp && (
                                        <Transition.Root show={showKtererSignUp} as={Fragment}>
                                            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef}
                                                    onClose={setShowKtererSignUp}>
                                                <Transition.Child
                                                    as={Fragment}
                                                    enter="ease-out duration-300"
                                                    enterFrom="opacity-0"
                                                    enterTo="opacity-100"
                                                    leave="ease-in duration-200"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <div
                                                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                                                </Transition.Child>

                                                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                                    <div
                                                        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                                        <Transition.Child
                                                            as={Fragment}
                                                            enter="ease-out duration-300"
                                                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                                                            leave="ease-in duration-200"
                                                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                                        >
                                                            <Dialog.Panel
                                                                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                                                <SignUpForm/>
                                                            </Dialog.Panel>
                                                        </Transition.Child>
                                                    </div>
                                                </div>
                                            </Dialog>
                                        </Transition.Root>
                                    )}
                                    <button
                                        type="button"
                                        className="rounded-full bg-primary-color px-3.5 py-2 font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        onClick={handleGetStarted}
                                    >
                                        Get Started
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                </>
            )}
        </Disclosure>
    )
}
