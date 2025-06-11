import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'animate.css';
import { AuthContext } from '../../Providers/AuthProvider';
import { toast } from 'react-toastify';

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate()


  useEffect(() => {
    axios.get(`http://localhost:5000/available-cars/${id}`, {
      withCredentials: true,
    })
      .then(response => {
        setCar(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to load car details');
        setIsLoading(false);
      });
  }, [id]);

  const handleBookNow = () => {
    axios.post("http://localhost:5000/my-bookings", {
      carData,
      carId: car?._id,
      userId: user?._id,
      email: user?.email,
      bookingCount: carData?.bookingCount + 1,
    })
    .then((res) =>{
      console.log(res.data);
      const data = res.data;
      toast.success("Car booked successfully")
      setTimeout(() =>{
        navigate("/my-bookings")
      }, 2000)
    })
    .catch((err) =>{
      toast.error(`Something went wrong ${err.message}`)
    })
  }

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!car) return <div className="text-center py-8">Car not found</div>;

  const carData = car.carData;

  return (
    <div className="container mx-auto px-4 py-8 animate__animated animate__fadeInUp">
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={carData?.imageUrl}
              alt={carData?.carModel}
              className="w-full h-full object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">
            {carData?.carModel}
          </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-blue-600">
              ${carData?.dailyRentalPrice}/day
            </span>
            <span className={`px-3 py-1 rounded-full ${
              carData?.availability === 'available'
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {carData?.availability === 'available' ? 'Available' : 'Not Available'}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Location</h3>
            <p className="text-gray-600">{carData?.location}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Features</h3>
            <div className="flex flex-wrap gap-2">
              {carData?.features?.map((feature, index) => (
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
            <p className="text-gray-600 leading-relaxed">{carData?.description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Vehicle Information</h3>
            <p className="text-gray-600">Registration Number: {carData?.vehicleRegistrationNumber}</p>
            <p className="text-gray-600">Booking Count: {carData?.bookingCount}</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            disabled={carData?.availability !== 'available'}
            className={`w-full py-3 text-lg font-semibold text-white rounded-lg transition-colors ${
              carData?.availability === 'available'
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
                <span className="font-semibold">Vehicle:</span> {carData?.carModel}
              </div>
              <div>
                <span className="font-semibold">Price per day:</span> ${carData?.dailyRentalPrice}
              </div>
              <div>
                <span className="font-semibold">Location:</span> {carData?.location}
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookNow}
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