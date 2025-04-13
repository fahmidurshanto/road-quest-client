import React from "react";
import { FaGasPump, FaCar, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

const RecentListings = () => {
  // Sample data - replace with your actual data later
  const listings = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      model: "Toyota Camry 2023",
      price: 45,
      availability: true,
      booking_count: 12,
      posted_date: "2 days ago",
      fuel_type: "Petrol",
      seats: 5
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      model: "Honda Civic 2022",
      price: 38,
      availability: true,
      booking_count: 8,
      posted_date: "5 days ago",
      fuel_type: "Hybrid",
      seats: 5
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1494976388901-750436ad5555?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      model: "Ford Mustang 2021",
      price: 89,
      availability: false,
      booking_count: 25,
      posted_date: "1 week ago",
      fuel_type: "Petrol",
      seats: 4
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      model: "Audi Q5 2023",
      price: 75,
      availability: true,
      booking_count: 5,
      posted_date: "3 days ago",
      fuel_type: "Diesel",
      seats: 5
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      model: "Tesla Model 3 2023",
      price: 82,
      availability: true,
      booking_count: 18,
      posted_date: "1 day ago",
      fuel_type: "Electric",
      seats: 5
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      model: "BMW X5 2022",
      price: 95,
      availability: false,
      booking_count: 22,
      posted_date: "2 weeks ago",
      fuel_type: "Diesel",
      seats: 5
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate__animated animate__fadeIn">
          Recent Listings
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((car, index) => (
            <div 
              key={car.id} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate__animated animate__fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={car.image} 
                  alt={car.model} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                  {car.booking_count} bookings
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{car.model}</h3>
                  <span className="text-lg font-bold text-blue-600">${car.price}<span className="text-sm font-normal text-gray-500">/day</span></span>
                </div>
                
                <div className="flex items-center mb-3">
                  {car.availability ? (
                    <span className="inline-flex items-center text-sm text-green-600">
                      <FaCheckCircle className="mr-1" /> Available now
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-sm text-red-600">
                      <FaCalendarAlt className="mr-1" /> Booked
                    </span>
                  )}
                  <span className="ml-auto text-sm text-gray-500">{car.posted_date}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span className="flex items-center">
                    <FaGasPump className="mr-1" /> {car.fuel_type}
                  </span>
                  <span className="flex items-center">
                    <FaCar className="mr-1" /> {car.seats} seats
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