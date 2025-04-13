import React from "react";
import "animate.css";

const SpecialOffers = () => {
  // These would be props in a real implementation
  const offers = [
    {
      id: 1,
      title: "Weekend Special",
      description: "Get 15% off for weekend rentals!",
      cta: "Book Now",
    },
    {
      id: 2,
      title: "Holiday Deal",
      description: "Luxury cars at $99/day this holiday season!",
      cta: "Learn More",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Special Offers</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="animate__animated animate__fadeInLeft bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:animate__pulse"
          >
            <h3 className="text-2xl font-semibold mb-2">{offer.title}</h3>
            <p className="text-lg mb-4">{offer.description}</p>
            <button
              className="px-6 py-2 bg-white text-blue-600 font-medium rounded-full hover:bg-gray-100 transition-colors duration-300"
              // onClick handler would be implemented later
            >
              {offer.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialOffers;