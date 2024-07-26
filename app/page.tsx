import Image from "next/image";
import Link from "next/link";
import {SignInButton, SignUpButton} from "@clerk/nextjs";
import Biryani from "@/static/landing-page/biryani.png";
import Knafeh from "@/static/landing-page/knafeh.png";
import Rendang from "@/static/landing-page/rendang.png";
import Ramen from "@/static/landing-page/ramen.png";
import Lasagna from "@/static/landing-page/lasagna.png";
import PadThai from "@/static/landing-page/pad-thai.png";
import BecomeKtererIcon from "@/static/landing-page/become-a-kterer-icon.svg";
import BecomeCustomerIcon from "@/static/landing-page/enjoy-homemade-food-icon.svg";
import Disgusted from "@/static/landing-page/disgusted.png";
import Family from "@/static/landing-page/family.png";
import Number1Icon from "@/static/shared/number-1-icon.svg";
import Number2Icon from "@/static/shared/number-2-icon.svg";
import Number3Icon from "@/static/shared/number-3-icon.svg";
import WhiteLogo from "@/static/red-logo.svg";
import LandingPicture from "@/static/home/landing_picture_new.jpg";

const steps = [
    {
        name: "Click Order Now",
        imgSrc: Number1Icon,
    },
    {
        name: "Checkout with the Food of Your Choice",
        imgSrc: Number2Icon,
    },
    {
        name: "Enjoy a Delicious Homemade Meal",
        imgSrc: Number3Icon,
    },
];

const PopularFoods = [
    {
        id: 1,
        name: 'Chicken Biryani',
        imageSrc: Biryani,
        imageAlt: "Chicken Biryani",
    },
    {
        id: 2,
        name: 'Knafeh',
        imageSrc: Knafeh,
        imageAlt: "Knafeh",
    },
    {
        id: 3,
        name: "Rendang",
        imageSrc: Rendang,
        imageAlt: "Rendang",
    },
    {
        id: 4,
        name: "Ramen",
        imageSrc: Ramen,
        imageAlt: "Ramen",
    },
    {
        id: 5,
        name: "Lasagna",
        imageSrc: Lasagna,
        imageAlt: "Lasagna",
    },
    {
        id: 6,
        name: "Pad Thai",
        imageSrc: PadThai,
        imageAlt: "Pad Thai",
    },
];

const BecomeTypes = [
    {
        title: "Become A Kterer",
        description: "Make money online making the things you love",
        imageSrc: BecomeKtererIcon,
        buttonText: "Start Earning",
        href: "/become-a-kterer",
    },
    {
        title: "Enjoy Homemade Food",
        description: "Eat homemade food wherever and whenever you want",
        imageSrc: BecomeCustomerIcon,
        buttonText: "Enjoy Now",
        href: "/",
    },
];

export default function Home() {
    return (
        <>
            {/* Section 1 */}
            <section className="w-full relative overflow-x-hidden">
                <Image src={LandingPicture} className="w-full h-[70vh] md:h-[100vh] object-cover"
                       alt="hero section food image"/>
                <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 py-2">
                    <div className="hidden md:flex flex-1"></div>
                    <div className="flex justify-center md:justify-start">
                        {/* <Image src={WhiteLogo} alt="Kterings Logo" className="z-10 h-16 w-16 md:h-24 md:w-24 "/> */}
                    </div>

                    <div className="flex space-x-2 md:space-x-4 flex-1 justify-end">
                        <SignInButton mode="modal">
                            <button
                                type="button"
                                className="text-sm md:text-base rounded-full bg-primary-color px-3 md:px-4 py-2 font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                            >
                                Sign In
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button
                                type="button"
                                className="text-sm md:text-base rounded-full bg-white px-3 md:px-4 py-2 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                            >
                                Sign Up
                            </button>
                        </SignUpButton>
                    </div>
                </div>
                {/* Center Content */}
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <Image src={WhiteLogo} alt="Kterings Logo" className="z-10 h-16 w-16 md:h-24 md:w-24 mb-10"/>
                    <h1 className="text-xl md:text-2xl lg:text-4xl  font-bold text-center mb-4 md:mb-8">
                        Order homemade food wherever and whenever you want!
                    </h1>
                    <SignUpButton mode="modal">
                        <button
                            type="button"
                            className="text-sm md:text-base rounded-full bg-primary-color px-3 md:px-4 py-2 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Order Now
                        </button>
                    </SignUpButton>
                </div>
            </section>

            {/* Section 2 */}
            <div className="bg-white max-w-7xl mx-auto">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Popular Homemade Food
                    </h2>
                    <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3 xl:gap-x-8">
                        {PopularFoods.map((food) => (
                            <div key={food.id} className="group relative">
                                <div
                                    className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-60">
                                    <Image
                                        src={food.imageSrc}
                                        alt={food.imageAlt}
                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                    />
                                </div>
                                <div className="mt-2">
                                    <div>
                                        <h3 className="text-xl">
                                            <span aria-hidden="true" className="absolute inset-0"/>
                                            {food.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Section 3 */}
            <section className="bg-white dark:bg-gray-900 max-w-7xl mx-auto">
                <div className="container px-6 py-12 mx-auto flex justify-center">
                    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 sm:gap-32">
                        {BecomeTypes.map((type, index) => (
                            <div key={index} className="w-full max-w-xs text-center">
                                <Image
                                    className="object-cover object-center w-full h-48 mx-auto rounded-lg"
                                    src={type.imageSrc}
                                    alt="avatar"
                                />

                                <div className="mt-2">
                                    <h3 className="text-2xl font-bold">{type.title}</h3>
                                    <p className="mt-2">{type.description}</p>
                                </div>

                                <Link href={type.href}>
                                    <button
                                        type="button"
                                        className="mt-4 rounded-full bg-primary-color px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                                    >
                                        {type.buttonText}
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4 */}
            <section className="max-w-7xl mx-auto">
                <div className="mx-auto max-w-screen-xl px-4 py-12 sm:py-12 sm:px-6 lg:py-24 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                        <div className="flex-1 relative aspect-w-16 aspect-h-9 lg:aspect-h-7">
                            <Image
                                alt="Person eating a burger and being disgusted"
                                src={Disgusted}
                                style={{objectFit: "cover", objectPosition: "center"}}
                                fill
                                className="rounded-lg"
                            />
                        </div>

                        <div className="flex-1 flex items-center justify-center">
                            <h2 className="text-3xl text-center">
                                You shouldn’t have to deal with eating fast food every time. You
                                deserve homemade food wherever and whenever you want
                            </h2>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 5 */}
            <section className="max-w-7xl mx-auto">
                <div className="bg-white py-12">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <p className="mt-2 text-3xl font-bold tracking-tight">
                                Get Homemade Food at the Snap of Your Fingers
                            </p>
                            <p className="mt-6 text-lg leading-8">All you have to do is</p>
                        </div>
                        <div className="mx-auto mt-16 sm:mt-12 max-w-xl lg:max-w-4xl">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                                {steps.map((step) => (
                                    <div
                                        key={step.name}
                                        className="relative flex flex-col items-center"
                                    >
                                        <Image
                                            src={step.imgSrc}
                                            alt=""
                                            className="mb-4 w-40 h-40 sm:w-40 sm:h-40"
                                        />
                                        <dt className="text-2xl leading-7 text-center">
                                            {step.name}
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
                                Order Now
                            </button>
                        </SignUpButton>
                    </div>
                </div>
            </section>

            {/* Section 6 */}
            <section className="max-w-7xl mx-auto">
                <div className="mx-auto max-w-screen-xl px-4 py-12 sm:py-12 sm:px-6 lg:py-24 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                        <div className="flex-1 flex items-center justify-center order-2 lg:order-1">
                            <h2 className="text-3xl text-center">
                                Everything you crave,
                                <br/>
                                homemade & delivered
                            </h2>
                        </div>

                        <div className="flex-1 relative aspect-w-16 aspect-h-9 lg:aspect-h-7 order-1 lg:order-2">
                            <Image
                                alt="Party"
                                src={Family}
                                style={{objectFit: "cover", objectPosition: "center"}}
                                fill
                                className="rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <SignUpButton mode="modal">
                            <button
                                type="button"
                                className="rounded-full bg-primary-color px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Order Now
                            </button>
                        </SignUpButton>
                    </div>
                </div>
            </section>
        </>
    );
}
