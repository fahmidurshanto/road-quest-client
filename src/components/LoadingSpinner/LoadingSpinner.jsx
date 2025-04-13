import React from "react";
import "animate.css";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="animate__animated animate__fadeIn animate__infinite animate__slower flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white text-xl font-semibold animate__animated animate__pulse animate__infinite">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;