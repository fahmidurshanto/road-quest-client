import React from "react";
import { FaChevronDown } from "react-icons/fa";
import "animate.css";
import { Link } from "react-router-dom";

const Banner = () => {

  const handleScrollClick = () => {
    const currentPosition = window.pageYOffset || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const targetPosition = currentPosition + viewportHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  };
  return (
    <>
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.ibb.co.com/LzNBrvh6/cars.jpg"
            alt="Luxury car"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <h1 className="animate__animated animate__fadeInDown text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Drive Your Dreams Today!
          </h1>
          <Link to="/availableCars">
          <button
            className="animate__animated cursor-pointer animate__fadeInUp animate__delay-1s bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            View Available Cars
          </button>
          </Link>
        </div>

        {/* Interactive scroll indicator */}
        <button 
          onClick={handleScrollClick}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce focus:outline-none"
          aria-label="Scroll to next section"
        >
          <FaChevronDown className="w-10 h-10 text-white hover:text-blue-300 transition-colors cursor-pointer" />
        </button>
      </section>
    </>
  );
};

export default Banner;