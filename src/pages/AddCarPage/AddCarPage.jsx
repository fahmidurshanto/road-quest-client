import React, { useContext, useEffect } from "react";
import "animate.css";
import axios from "axios";
import { AuthContext } from "../../Providers/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddCarPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) {
      toast.error("Please login to add a car");
      navigate("/login");
    }
  }, [user, navigate]);

  // Form fields will be handled later
  const handleAddCar = (e) => {
    e.preventDefault();
    if (!user?.email) {
      toast.error("Please login to add a car");
      return;
    }

    const form = e.target;
    const carModel = form.carModel.value;
    const dailyRentalPrice = form.dailyRentalPrice.value;
    const availability = form.availability.value;
    const vehicleRegistrationNumber = form.vehicleRegistrationNumber.value;
    const features = Array.from(form.features).filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
    const description = form.description.value;
    const imageUrl = form.imageUrl.value;
    const location = form.location.value;
    const bookingCount = form.bookingCount.value;
    // Form submission logic will be implemented later
    const carData = {
      carModel,
        dailyRentalPrice,
        availability,
        vehicleRegistrationNumber,
        features,
        description,
        imageUrl,
        location,
        bookingCount,
        email: user?.email,
        user
  }
  axios.post(`http://localhost:5000/my-cars`, {
  carData,
  email: user?.email,
  availability,
    withCredentials: true
  })
  .then((res) =>{
    console.log(res.data);
    const data = res.data;
    toast.success("Car added successfully")
    setTimeout(() =>{
      form.reset();

    }, 2000)
  })
  .catch((err) =>{
    console.log(err)
    toast.error(`Something went wrong ${err.message}`)
  })
  };

  return (
    <div className="animate__animated animate__fadeIn min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="animate__animated animate__fadeInDown bg-white shadow-xl rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Add New Car</h2>
          
          <form onSubmit={handleAddCar} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Car Model */}
              <div className="animate__animated animate__fadeInLeft">
                <label htmlFor="carModel" className="block text-sm font-medium text-gray-700 mb-1">
                  Car Model
                </label>
                <input
                  type="text"
                  id="carModel"
                  name="carModel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  placeholder="e.g. Toyota Camry"
                />
              </div>

              {/* Daily Rental Price */}
              <div className="animate__animated animate__fadeInRight">
                <label htmlFor="dailyRentalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Rental Price ($)
                </label>
                <input
                  type="number"
                  id="dailyRentalPrice"
                  name="dailyRentalPrice"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  placeholder="e.g. 50"
                />
              </div>

              {/* Availability */}
              <div className="animate__animated animate__fadeInLeft">
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="maintenance">In Maintenance</option>
                </select>
              </div>

              {/* Vehicle Registration Number */}
              <div className="animate__animated animate__fadeInRight">
                <label htmlFor="vehicleRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Registration Number
                </label>
                <input
                  type="text"
                  id="vehicleRegistrationNumber"
                  name="vehicleRegistrationNumber"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  placeholder="e.g. ABC1234"
                />
              </div>

              {/* Features */}
              <div className="animate__animated animate__fadeInLeft md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {['GPS', 'AC', 'Bluetooth', 'USB Port', 'Sunroof', 'Heated Seats', 'Backup Camera', 'Auto Transmission'].map((feature) => (
                    <div key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`feature-${feature}`}
                        name="features"
                        value={feature}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-gray-700">
                        {feature}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="animate__animated animate__fadeInRight md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  placeholder="Describe the car features and condition"
                />
              </div>

              {/* Image URL */}
              <div className="animate__animated animate__fadeInLeft md:col-span-2">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  placeholder="https://example.com/car-image.jpg"
                />
              </div>

              {/* Location */}
              <div className="animate__animated animate__fadeInRight md:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                  placeholder="e.g. New York, NY"
                />
              </div>

              {/* Booking Count - Hidden */}
              <input
                type="hidden"
                id="bookingCount"
                name="bookingCount"
                value="0"
              />
            </div>

            {/* Submit Button */}
            <div className="animate__animated animate__fadeInUp flex justify-center mt-8">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-300 hover:animate__animated hover:animate__pulse"
              >
                Add Car
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCarPage;