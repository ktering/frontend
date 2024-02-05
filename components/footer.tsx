import RedLogo from "@/static/red-logo.svg";
import Image from "next/image";
import Link from "next/link";
import FBLogo from "@/static/fb-logo.svg";
import IGLogo from "@/static/ig-logo.svg";

const footerLinks = {
    GetToKnowUs: [
        { title: "About Us", href: "/about-us" }
    ],
    DoingBusiness: [
        { title: "Become a Kterer", href: "/become-a-kterer" }
    ],
    HelpfulLinks: [
        { title: "Submit a Ticket", href: "/help#submit-ticket" },
        { title: "Report a Bug", href: "/help#submit-bug-report" },
        { title: "FAQs", href: "/help" }
    ],
    Legal: [
        { title: "Terms and Conditions", href: "/legal/terms-and-conditions" },
        { title: "Vendor Terms and Conditions", href: "/legal/vendor-terms-and-conditions" },
        { title: "Privacy Policy", href: "/legal/privacy-policy" },
        { title: "Delivery Policy", href: "/legal/delivery-policy" }
    ]
};

export default function Footer() {
    return (
        <div className="bg-gray-100">
            <footer className="max-w-7xl mx-auto">
                <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-24 sm:px-6 lg:space-y-16 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div>
                            <div className="text-teal-600">
                                <Image src={RedLogo} alt="Kterings Logo" height={100} width={100} />
                            </div>

                            <ul className="mt-8 flex gap-6">
                                <li>
                                    <a
                                        href="https://www.facebook.com/profile.php?id=61552576481418"
                                        rel="noreferrer"
                                        target="_blank"
                                        className="text-gray-700 transition hover:opacity-75"
                                    >
                                        <span className="sr-only">Facebook</span>
                                        <Image src={FBLogo} className="h-5 w-5" alt="Facebook Logo" />
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="https://www.instagram.com/kterings/"
                                        rel="noreferrer"
                                        target="_blank"
                                        className="text-gray-700 transition hover:opacity-75"
                                    >
                                        <span className="sr-only">Instagram</span>
                                        <Image src={IGLogo} className="h-5 w-5" alt="Instagram Logo" />
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
                            {Object.entries(footerLinks).map(([key, links]) => (
                                <div key={key}>
                                    <p className="font-medium text-gray-900">{key.split(/(?=[A-Z])/).join(" ")}</p>
                                    <ul className="mt-6 space-y-4 text-sm">
                                        {links.map(link => (
                                            <li key={link.href}>
                                                <Link href={link.href}
                                                    className="text-gray-700 transition hover:opacity-75">
                                                    {link.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()}. Kterings. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
