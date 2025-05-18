import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

const RecentListings = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/cars")
      .then(response => {
        const sortedCars = response?.data
          ?.sort((a, b) => parseInt(b?.user?.createdAt || 0) - parseInt(a?.user?.createdAt || 0))
          ?.slice(0, 8) || []; // Show max 8 latest cars
        setCars(sortedCars);
        setLoading(false);
      })
      .catch(err => {
        setError(err?.message || "Failed to fetch listings");
        setLoading(false);
      });
  }, []);

  const getPostedDate = (createdAt) => {
    if (!createdAt) return "Added recently";
    const createdDate = new Date(parseInt(createdAt));
    const currentDate = new Date();
    const diffTime = currentDate - createdDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Added today";
    if (diffDays === 1) return "Added 1 day ago";
    return `Added ${diffDays} days ago`;
  };

  if (loading) return <div className="text-center py-16">Loading recent listings...</div>;
  if (error) return <div className="text-center py-16 text-red-500">Error: {error}</div>;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Recent Listings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars?.map((car, index) => (
            <div 
              key={car?._id || index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={car?.carData?.imageUrl || "https://via.placeholder.com/400x300"}
                  alt={car?.carData?.carModel}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  {car?.carData?.bookingCount || 0} bookings
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {car?.carData?.carModel || "New Listing"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {car?.carData?.location || "Location not specified"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600">
                      ${car?.carData?.dailyRentalPrice || "00"}
                    </span>
                    <span className="text-gray-500 text-sm block">/day</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center space-x-2">
                    {car?.carData?.availability === "available" ? (
                      <span className="inline-flex items-center text-sm text-green-600">
                        <FaCheckCircle className="mr-1.5" /> Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-sm text-red-600">
                        <FaCalendarAlt className="mr-1.5" /> Booked
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {getPostedDate(car?.user?.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentListings;