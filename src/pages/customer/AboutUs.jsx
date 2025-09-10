import React from "react";
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="font-nunito text-black min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto mt-8 sm:mt-12 px-4 sm:px-6 md:px-12">
        <img
          src="./aboutUs.jpg"
          alt="Kterings"
          className="w-full sm:w-[95%] mx-auto h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-lg shadow-md"
        />
      </section>

      {/* About Text Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-12 space-y-10 sm:space-y-12">

        {/* Our Mission */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-1.5 h-6 bg-primary rounded-full mr-3"></div>
            <h3 className="text-primary font-semibold uppercase text-xs sm:text-sm md:text-base tracking-wider">
              Our Mission
            </h3>
          </div>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            At Kterings, we believe that every meal should be an experience to
            remember. As a forward-thinking "tech" company, we take pride in
            seamlessly orchestrating catering services that bring a diverse array
            of culinary delights right to your doorstep. Our passion lies in
            turning ordinary meals into truly unforgettable moments, moments that
            can be only made with homemade food. We do this by connecting
            exceptional at-home caterers with clients who demand excellent
            homemade food every day.
          </p>
        </div>

        {/* Our Story */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-1.5 h-6 bg-primary rounded-full mr-3"></div>
            <h3 className="text-primary font-semibold uppercase text-xs sm:text-sm md:text-base tracking-wider">
              Our Story
            </h3>
          </div>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            Kterings was born out of a passion for exceptional homemade food and a
            commitment to delivering amazing catering services. We recognized the
            need for a platform that simplifies the process of finding
            professional caterers who make homemade food for daily needs. We
            understood the pains of eating restaurant-made fast food. Kterings is
            committed to quality, reliability, and customer satisfaction. We
            believe that every customer’s taste is unique, and we strive to provide
            personalized food and support to ensure that our caterers meet each
            one’s specific needs and exceed expectations.
          </p>
          <p className="mt-3 sm:mt-4 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            We are driven by our purpose to provide homemade food wherever and
            whenever you want. From breakfast to lunch, from Indian cuisine to
            Chinese delicacies, we cover a wide variety of culinary tastes. We are
            proud to contribute to a happier, healthier society.
          </p>
          <p className="mt-3 sm:mt-4 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            There’s no need to make food at home when you can get something
            homemade through Kterings from a Kterer of your choice. Click{" "}
            <Link to="/menu" className="underline text-primary hover:text-black">
              "Order Now"
            </Link>{" "}
            to start!
          </p>
        </div>

        {/* For Kterers */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-1.5 h-6 bg-primary rounded-full mr-3"></div>
            <h3 className="text-primary font-semibold uppercase text-xs sm:text-sm md:text-base tracking-wider">
              For Kterers
            </h3>
          </div>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            Love to make food? Make money by doing what you love! Reach a wide
            variety of customers, market your daily homemade goods, and make more
            money by offering delivery, pickup, and direct online ordering with
            Kterings.
          </p>
        </div>

        {/* For Communities */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-1.5 h-6 bg-primary rounded-full mr-3"></div>
            <h3 className="text-primary font-semibold uppercase text-xs sm:text-sm md:text-base tracking-wider">
              For Communities
            </h3>
          </div>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            Kterings is dedicated to empowering individuals all around the world
            by giving them an opportunity to make money at home by making the
            things they love. At Kterings, we strive to build the future of what
            it means to “work”!
          </p>
        </div>

      </section>

      <Footer />
    </div>
  );
}
