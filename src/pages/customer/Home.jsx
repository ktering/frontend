import Header from "../../components/customer/Header";
import Hero from "../../components/customer/home/Hero";
import CategorySection from "../../components/customer/home/CategorySection";
import FoodGridSection from "../../components/customer/home/FoodGridSection";
export default function Home() {

    return (
        <div>
            <Header />
            <div className="div  mt-8 w-4/5 mx-auto">
                <Hero />
            <section className="w-full px-4 py-10 max-w-6xl lg:max-w-[86%] mx-auto">
                <h2 className="text-2xl font-bold text-center mb-8">
                    Explore Homemade Food
                </h2>
                <CategorySection />
                <FoodGridSection limit={8} showButton={true} />
            </section>
            </div>

        </div>
    );
}
