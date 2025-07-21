import Header from "../../components/customer/Header";
import Hero from "../../components/customer/home/Hero";
import CategorySection from "../../components/customer/home/CategorySection";
import FoodGridSection from "../../components/customer/home/FoodGridSection";
import AboutSection from "../../components/customer/home/AboutSection";
import Services from "../../components/customer/home/Services";
import Testimonials from "../../components/customer/home/Testimonials";
import Footer from "../../components/customer/home/Footer";
export default function Home() {

    return (
        <>
            <Header />
            <div className="div mt-8 w-4/5 mx-auto">
                <Hero />
                <section className="w-full py-10 px-2 sm:px-4">
                    <h2 className="text-2xl font-bold text-center mb-8">Explore Homemade Food</h2>
                    <CategorySection />
                    <FoodGridSection limit={8} showButton={true} />
                </section>
                <Services />
                <AboutSection />
                <Testimonials/>
            </div>
            <Footer />

        </>
    );
}
