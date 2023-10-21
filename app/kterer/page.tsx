import Image from "next/image";
import {SignUpButton} from "@clerk/nextjs";
import MainChefImage from "@/static/kterer/main-chef.png";
import ShouldntDealWithImage from "@/static/kterer/shouldnt-deal.png";
import SetYourPricesIcon from "@/static/kterer/set-your-prices-icon.svg";
import ReachMorePeopleIcon from "@/static/kterer/reach-more-people-icon.svg";
import MakeWhatYouWantIcon from "@/static/kterer/make-what-you-want-icon.svg";
import Number1Icon from "@/static/shared/number-1-icon.svg";
import Number2Icon from "@/static/shared/number-2-icon.svg";
import Number3Icon from "@/static/shared/number-3-icon.svg";
import Freedom from "@/static/kterer/freedom.png";

const features = [
    {
        name: 'Set Your Prices',
        desc: 'Earn what you want! No more bosses dictating what you can earn.',
        imgSrc: SetYourPricesIcon,
    },
    {
        name: 'Reach More People',
        desc: 'Don’t be restricted to the people you know. Reach more people in your community',
        imgSrc: ReachMorePeopleIcon,
    },
    {
        name: 'Make What You Want',
        desc: 'You don’t have to be restricted to a set menu. Make whatever you feel like whenever you feel like it!',
        imgSrc: MakeWhatYouWantIcon
    },
]

const ktererSteps = [
    {
        name: 'Click Sign Up',
        imgSrc: Number1Icon,
    },
    {
        name: 'Fill Out Required Info',
        imgSrc: Number2Icon,
    },
    {
        name: 'Enjoy Making More Money as a Kterer',
        imgSrc: Number3Icon
    },
]

export default function KtererMainPage() {
    return (
        <>
            {/* Section 1 */}
            <section className="bg-primary-color text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:pt-12 lg:pb-24 lg:px-8">
                        <h1 className="text-3xl font-bold text-center pb-16">Become a Kterer</h1>
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                            <div
                                className="flex-1 flex flex-col items-center justify-center text-center lg:text-left lg:items-start lg:justify-start">
                                <h2 className="text-2xl font-bold leading-10">
                                    Make What You Want<br/>Reach More People<br/>Sell More
                                </h2>

                                <p className="pt-4 pb-6">Make more money doing what you like</p>

                                <button
                                    type="button"
                                    className="text-sm w-1/3 lg:w-2/3 md:text-base rounded-full bg-white px-3 md:px-4 py-2 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Sign Up
                                </button>
                            </div>

                            <div className="flex-2 relative">
                                <div className="overflow-hidden rounded-lg">
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
                <div className="bg-white py-24 sm:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-xl lg:max-w-4xl">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-48 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                                {features.map((feature) => (
                                    <div key={feature.name} className="relative flex flex-col items-center">
                                        <Image src={feature.imgSrc} alt="" className="w-20 h-20 sm:w-20 sm:h-20"/>
                                        <dt className="text-2xl font-bold leading-7 text-center my-4">
                                            {feature.name}
                                        </dt>
                                        <dt className="text-center max-w-sm">
                                            {feature.desc}
                                        </dt>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </section>
            {/* Section 3 */}
            <section className="lg:bg-gradient-to-r lg:from-red-50 lg:to-red-200">
                <div className="max-w-7xl mx-auto ">
                    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-24 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                            <div className="flex-2 relative">
                                <div className="overflow-hidden rounded-lg">
                                    <Image
                                        alt="Chef standing in a kitchen"
                                        src={ShouldntDealWithImage}
                                        className="object-cover object-center w-full h-full"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 flex items-center justify-center">
                                <h2 className="text-3xl text-center">
                                    You shouldn’t have to deal with only catering to the people you know. You deserve to
                                    be
                                    able to reach more people to sell to
                                </h2>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            {/* Section 4 */}
            <section className="max-w-7xl mx-auto">
                <div className="bg-white py-24 sm:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <p className="mt-2 text-3xl font-bold tracking-tight">
                                Be a Kterer in 3 Easy Steps
                            </p>
                            <p className="mt-6 text-lg leading-8">
                                All you have to do is
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                                {ktererSteps.map((feature) => (
                                    <div key={feature.name} className="relative flex flex-col items-center">
                                        <Image src={feature.imgSrc} alt=""
                                               className="mb-4 w-40 h-40 sm:w-40 sm:h-40"/>
                                        <dt className="text-2xl leading-7 text-center">
                                            {feature.name}
                                        </dt>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <SignUpButton mode="modal">
                            <button
                                type="button"
                                className="rounded-full bg-primary-color px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign Up
                            </button>
                        </SignUpButton>
                    </div>
                </div>
            </section>
            {/* Section 5 */}
            <section className="lg:bg-gradient-to-l lg:from-red-50 lg:to-red-200">
                <div className="max-w-7xl mx-auto">
                    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-24 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                            <div className="flex-1 flex flex-col items-center justify-center order-2 lg:order-1">
                                <h1 className="text-3xl font-bold mb-2">Freedom!</h1>
                                <h2 className="text-2xl text-center">
                                    You shouldn’t have to deal with only catering to the people you know. You deserve to
                                    be able to reach more people to sell to
                                </h2>
                            </div>

                            <div className="flex-2 relative order-1 lg:order-2">
                                <div className="overflow-hidden rounded-lg">
                                    <Image
                                        alt="Chef standing in a kitchen"
                                        src={Freedom}
                                        className="object-cover object-center w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}