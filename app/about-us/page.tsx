import AboutUsImage from "@/static/about-us/about-us.png";
import Image from "next/image";

export default function AboutUs() {
    return (
        <>
            <div className="flex flex-col lg:flex-row-reverse items-center">
                <Image src={AboutUsImage} alt="picture of a woman" className="w-full lg:w-1/2 lg:order-2 object-cover object-bottom max-h-[620px] lg:max-h-max" />
                <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 lg:w-1/2">
                    <p className="font-bold text-xl mb-4">Our Mission</p>
                    <p className="mb-4">At Kterings, we believe that every meal should be an experience to remember. We
                        are
                        an innovative
                        "tech" company specialized in the smooth coordination of catering services, providing a wide
                        range
                        of culinary homemade delights wherever and whenever you want. Our mission is to transform
                        ordinary
                        meals into extraordinary moments. Moments that can be only made with homemade food, and we do
                        this
                        by connecting exceptional at home caterers with clients who demand excellent homemade food every
                        day.</p>
                    <p className="font-bold text-xl mb-4">Our Story</p>
                    <p className="mb-4">Kterings was born out of a passion for exceptional homemade food and a
                        commitment to
                        delivering
                        breathtaking catering services. We recognized the need for a platform that simplifies the
                        process of
                        finding professional caterers that make homemade food for daily needs. We understood the pains
                        of
                        eating restaurant made fast food. At our company, we are committed to quality, reliability and
                        customer satisfaction. We believe that every customers taste is unique, and we strive to provide
                        the
                        personalized food and support to ensure that our caterers (or Kterers as we call them) meet your
                        specific needs and exceed your expectations.</p>
                    <p className="mb-4">We are driven by our purpose, to provide homemade food wherever and whenever you
                        want. From breakfast
                        to lunch, from Indian cuisine to Chinese delicacies, we cover them all. We are proud to
                        contribute
                        to a happier, healthier society.</p>
                    <p className="mb-4">No need to make food at home when you can Kter homemade food through Kterings
                        with a
                        Kterer of your
                        choice. Just click "Order Now"</p>
                    <p className="font-bold text-xl mb-4">For Kterers</p>
                    <p className="mb-4">Love to make food? Then why not make money making the things you love? Reach a
                        wide
                        variety of
                        customers, market your daily homemade goods and make more money by offering delivery, pickup,
                        and
                        direct online ordering with Kterings. "Become a Kterer" - button</p>
                    <p className="font-bold text-xl mb-4">For Communities</p>
                    <p>Kterings impact is dedicated to empowering individuals all around the world by giving them a
                        opportunity to make money at home, making the things they love. At Kterings, we strive to build
                        the
                        future of work.</p>
                    <p>&nbsp;</p>
                </div>
            </div>
        </>
    )
}
