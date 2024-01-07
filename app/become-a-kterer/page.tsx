"use client";
import Image from "next/image";
import MainChefImage from "@/static/kterer/main-chef.png";
import ShouldntDealWithImage from "@/static/kterer/shouldnt-deal.png";
import SetYourPricesIcon from "@/static/kterer/set-your-prices-icon.svg";
import ReachMorePeopleIcon from "@/static/kterer/reach-more-people-icon.svg";
import MakeWhatYouWantIcon from "@/static/kterer/make-what-you-want-icon.svg";
import Number1Icon from "@/static/shared/number-1-icon.svg";
import Number2Icon from "@/static/shared/number-2-icon.svg";
import Number3Icon from "@/static/shared/number-3-icon.svg";
import Freedom from "@/static/kterer/freedom.png";
import SignUpForm from "@/app/sign-up/[[...sign-up]].page";

import {Fragment, useRef, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";

const features = [
    {
        name: "Set Your Prices",
        desc: "Earn what you want! No more bosses dictating what you can earn.",
        imgSrc: SetYourPricesIcon,
    },
    {
        name: "Reach More People",
        desc: "Don’t be restricted to the people you know. Reach more people in your community",
        imgSrc: ReachMorePeopleIcon,
    },
    {
        name: "Make What You Want",
        desc: "You don’t have to be restricted to a set menu. Make whatever you feel like whenever you feel like it!",
        imgSrc: MakeWhatYouWantIcon,
    },
];

const ktererSteps = [
    {
        name: "Click Sign Up",
        imgSrc: Number1Icon,
    },
    {
        name: "Fill Out Required Info",
        imgSrc: Number2Icon,
    },
    {
        name: "Enjoy Making More Money as a Kterer",
        imgSrc: Number3Icon,
    },
];

export default function BecomeKterer() {
    const [open, setOpen] = useState(false);
    const cancelButtonRef = useRef(null);

    return (
        <>
            {/* Section 1 */}
            <section className="bg-primary-color text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:pt-12 lg:pb-24 lg:px-8">
                        <h1 className="text-3xl font-bold text-center pb-16">
                            Become a Kterer
                        </h1>
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">
                            <div
                                className="lg:col-span-2 flex flex-col items-center justify-center align-middle text-center lg:text-left lg:items-start lg:justify-center">
                                <h2 className="text-3xl font-bold leading-10">
                                    Make What You Want
                                    <br/>
                                    Reach More People
                                    <br/>
                                    Sell More
                                </h2>

                                <p className="pt-4 pb-6">Make more money doing what you like</p>

                                <button
                                    className="rounded-full w-1/3 lg:w-2/3 bg-white px-4 py-2.5 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                                    onClick={() => setOpen(true)}
                                >
                                    Sign Up
                                </button>

                                <Transition.Root show={open} as={Fragment}>
                                    <Dialog
                                        as="div"
                                        className="relative z-10"
                                        initialFocus={cancelButtonRef}
                                        onClose={setOpen}
                                    >
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
                            </div>

                            <div className="lg:col-span-3 relative">
                                <div className="overflow-hidden rounded-lg h-full">
                                    <Image
                                        alt="Chef standing in a kitchen"
                                        src={MainChefImage}
                                        className="object-cover object-center w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Section 2 */}
            <section className="max-w-7xl mx-auto">
                <div className="bg-white py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-xl lg:max-w-5xl">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-24 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                                {features.map((feature) => (
                                    <div
                                        key={feature.name}
                                        className="relative flex flex-col items-center"
                                    >
                                        <Image
                                            src={feature.imgSrc}
                                            alt=""
                                            className="w-20 h-20 sm:w-20 sm:h-20"
                                        />
                                        <dt className="text-2xl font-bold leading-7 text-center my-4">
                                            {feature.name}
                                        </dt>
                                        <dt className="text-center max-w-sm">{feature.desc}</dt>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </section>
            {/* Section 3 */}
            <section className="lg:bg-gradient-to-r lg:from-red-50 lg:to-red-200">
                <div className="max-w-7xl mx-auto">
                    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                            <div className="relative">
                                <div className="overflow-hidden rounded-lg h-full">
                                    <Image
                                        alt="Chef standing in a kitchen"
                                        src={ShouldntDealWithImage}
                                        width={500}
                                        height={500}
                                        className="object-cover object-center w-full h-full"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <h2 className="text-3xl text-center">
                                    You shouldn’t have to deal with only catering to the people
                                    you know. You deserve to be able to reach more people to sell
                                    to
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Section 4 */}
            <section className="max-w-7xl mx-auto">
                <div className="bg-white py-12">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <p className="mt-2 text-3xl font-bold tracking-tight">
                                Be a Kterer in 3 Easy Steps
                            </p>
                            <p className="mt-6 text-lg leading-8">All you have to do is</p>
                        </div>
                        <div className="mx-auto mt-16 max-w-xl sm:mt-20 lg:mt-12 lg:max-w-4xl">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                                {ktererSteps.map((feature) => (
                                    <div
                                        key={feature.name}
                                        className="relative flex flex-col items-center"
                                    >
                                        <Image
                                            src={feature.imgSrc}
                                            alt=""
                                            className="mb-4 w-40 h-40 sm:w-40 sm:h-40"
                                        />
                                        <dt className="text-2xl leading-7 text-center">
                                            {feature.name}
                                        </dt>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <button
                            className="rounded-full bg-primary-color px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => setOpen(true)}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </section>
            {/* Section 5 */}
            <section className="lg:bg-gradient-to-l lg:from-red-50 lg:to-red-200">
                <div className="max-w-7xl mx-auto">
                    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                            <div className="flex items-center justify-center order-2 lg:order-1">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2 text-center">
                                        Freedom!
                                    </h1>
                                    <h2 className="text-2xl text-center">
                                        You shouldn’t have to deal with only catering to the people
                                        you know. You deserve to be able to reach more people to
                                        sell to
                                    </h2>
                                </div>
                            </div>

                            <div className="relative order-1 lg:order-2">
                                <div className="overflow-hidden rounded-lg h-full">
                                    <Image
                                        alt="Chef standing in a kitchen"
                                        src={Freedom}
                                        width={500}
                                        height={500}
                                        className="object-cover object-center w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
