import AboutUsImage from "@/static/about-us/about-us.png";
import Image from "next/image";
import Link from "next/link";

export default function AboutUs() {
    return (
        <>
            <div className="flex flex-col lg:flex-row-reverse items-center">
                <Image src={AboutUsImage} alt="picture of a woman"
                       className="w-full lg:w-1/3 lg:order-2 object-cover object-bottom max-h-[620px] lg:max-h-[920px]"/>
                <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 lg:w-2/3">
                    <p className="font-bold text-xl mb-4">Our Mission</p>
                    <p className="mb-4">At Kterings, we believe that every meal should be an experience to remember. As
                        a forward-thinking "tech" company, we take pride in seamlessly orchestrating catering services
                        that bring a diverse array of culinary delights right to your doorstep. Our passion lies in
                        turning ordinary meals into truly unforgettable moments, moments that can be only made with
                        homemade food. We do this by connecting exceptional at-home caterers with clients who demand
                        excellent homemade food every day.</p>
                    <p className="font-bold text-xl mb-4">Our Story</p>
                    <p className="mb-4">Kterings was born out of a passion for exceptional homemade food and a
                        commitment to delivering amazing catering services. We recognized the need for a platform that
                        simplifies the process of finding professional caterers who make homemade food for daily needs.
                        We understood the pains of eating restaurant-made fast food. Kterings is committed to quality,
                        reliability, and customer satisfaction. We believe that every customer’s taste is unique, and we
                        strive to provide personalized food and support to ensure that our caterers (or Kterers as we
                        call them) meet each one’s specific needs and exceed expectations.</p>
                    <p className="mb-4">We are driven by our purpose to provide homemade food wherever and whenever you
                        want. From breakfast to lunch, from Indian cuisine to Chinese delicacies, we cover a wide
                        variety of culinary tastes. We are proud to contribute to a happier, healthier society.</p>
                    <p className="mb-4">There’s no need to make food at home when you can get something homemade through
                        Kterings from a Kterer of your choice. Click <Link href="/" className="underline hover:text-primary-color">"Order
                            Now"</Link> to start!</p>
                    <p className="font-bold text-xl mb-4">For Kterers</p>
                    <p className="mb-4">Love to make food? Make money by doing what you love! Reach a wide variety of
                        customers, market your daily homemade goods, and make more money by offering delivery, pickup,
                        and direct online ordering with Kterings. <Link href="/become-a-kterer" className="underline hover:text-primary-color">Want
                            to become a Kterer?</Link></p>
                    <p className="font-bold text-xl mb-4">For Communities</p>
                    <p>Kterings is dedicated to empowering individuals all around the world by giving them an
                        opportunity to make money at home by making the things they love. At Kterings, we strive to
                        build the future of what it means to “work”!</p>
                    <p>&nbsp;</p>
                </div>
            </div>
        </>
    )
}
