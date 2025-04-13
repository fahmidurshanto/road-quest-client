import React from "react";
import { FaCarAlt, FaMoneyBillWave, FaMobileAlt, FaHeadset } from "react-icons/fa";

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 animate__animated animate__fadeIn">
          Why Choose Us?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Wide Variety of Cars */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 animate__animated animate__fadeInUp animate__delay-1s">
            <div className="text-blue-500 mb-6 flex justify-center">
              <FaCarAlt className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Wide Variety of Cars</h3>
            <p className="text-gray-600 text-center">
              From budget-friendly options to luxury vehicles, we have the perfect ride for every need.
            </p>
          </div>

          {/* Affordable Prices */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 animate__animated animate__fadeInUp animate__delay-2s">
            <div className="text-blue-500 mb-6 flex justify-center">
              <FaMoneyBillWave className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Affordable Prices</h3>
            <p className="text-gray-600 text-center">
              Competitive daily rates you can count on with no hidden charges.
            </p>
          </div>

          {/* Easy Booking Process */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 animate__animated animate__fadeInUp animate__delay-3s">
            <div className="text-blue-500 mb-6 flex justify-center">
              <FaMobileAlt className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Easy Booking Process</h3>
            <p className="text-gray-600 text-center">
              Seamlessly book your ride in just a few clicks with our user-friendly platform.
            </p>
          </div>

          {/* Customer Support */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 animate__animated animate__fadeInUp animate__delay-4s">
            <div className="text-blue-500 mb-6 flex justify-center">
              <FaHeadset className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">24/7 Customer Support</h3>
            <p className="text-gray-600 text-center">
              Round-the-clock assistance for all your queries and concerns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;