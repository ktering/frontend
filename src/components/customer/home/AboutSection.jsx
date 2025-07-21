
import { ChefHat, ShoppingBag, BadgeCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import mainImg from "../../../assets/about/chef.jpg";
import stewImg from "../../../assets/about/veggie-stew.jpg";
import steakImg from "../../../assets/about/grilled-paneer.jpg";

export default function AboutSection() {
    return (
        <section className="w-full bg-white py-12 font-nunito px-2 sm:px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* LEFT SIDE: TEXT */}
                <div>
                    <h3 className="text-primary font-semibold uppercase text-sm sm:text-base tracking-wider mb-2 border-l-4 border-primary pl-3">
                        About Us
                    </h3>

                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-black leading-tight">
                        Home-cooked goodness, delivered to your door.
                    </h2>

                    <p className="text-sm sm:text-base text-gray-700 mb-6">
                        Kterings brings real, homemade meals from trusted local kitchens right to your door — made with love and served with simplicity.
                    </p>

                    <ul className="space-y-4 mb-6">
                        <li className="flex items-start gap-3">
                            <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                            <span className="text-black text-sm sm:text-base">
                                Homemade meals by real people, made with love.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                            <span className="text-black text-sm sm:text-base">
                                Simple ordering. No hassle.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                            <span className="text-black text-sm sm:text-base">
                                100% Halal & Affordable.
                            </span>
                        </li>
                    </ul>

                    <div className="mt-6">
                        <Link to="/menu">
                            <button className="group bg-primary hover:bg-primary/90 text-white text-sm font-medium px-6 py-2 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto">
                                Start Your Order
                                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </button>
                        </Link>
                    </div>
                </div>

                {/* RIGHT SIDE: IMAGE COLLAGE */}
                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                    <img
                        src={mainImg}
                        alt="Kitchen setup"
                        className="row-span-2 rounded-xl shadow-lg object-cover w-full h-full max-h-[300px] sm:max-h-[400px] lg:max-h-full transition-transform duration-300 hover:scale-105"
                    />
                    <img
                        src={stewImg}
                        alt="Vegetable stew"
                        className="rounded-xl shadow-md object-cover w-full h-full max-h-[140px] sm:max-h-[180px] lg:max-h-full transition-transform duration-300 hover:scale-105"
                    />
                    <img
                        src={steakImg}
                        alt="Grilled paneer"
                        className="rounded-xl shadow-md object-cover w-full h-full max-h-[140px] sm:max-h-[180px] lg:max-h-full transition-transform duration-300 hover:scale-105"
                    />
                </div>
            </div>
        </section>
    );
}
