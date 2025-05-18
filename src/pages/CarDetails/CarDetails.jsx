import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'animate.css';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    axios.get(`/api/cars/${id}`)
      .then(response => {
        setCar(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to load car details');
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!car) return <div className="text-center py-8">Car not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 animate__animated animate__fadeInUp">
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={car.images[selectedImage]}
              alt={car.model}
              className="w-full h-full object-cover rounded-xl shadow-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {car.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  index === selectedImage ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <img
                  src={img}
                  alt={`${car.model} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">
            {car.brand} {car.model}
          </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-blue-600">
              ${car.pricePerDay}/day
            </span>
            <span className={`px-3 py-1 rounded-full ${
              car.availability 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {car.availability ? 'Available' : 'Not Available'}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Features</h3>
            <div className="flex flex-wrap gap-2">
              {car.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Description</h3>
            <p className="text-gray-600 leading-relaxed">{car.description}</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            disabled={!car.availability}
            className={`w-full py-3 text-lg font-semibold text-white rounded-lg transition-colors ${
              car.availability
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate__animated animate__fadeIn">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Vehicle:</span> {car.brand} {car.model}
              </div>
              <div>
                <span className="font-semibold">Price per day:</span> ${car.pricePerDay}
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;