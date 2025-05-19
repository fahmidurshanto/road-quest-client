import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { format, differenceInDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'animate.css';
import { AuthContext } from '../../Providers/AuthProvider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDates, setNewDates] = useState({ start: null, end: null });
  const { user } = useContext(AuthContext);
  const email = user?.email;

  useEffect(() => {
    const fetchBookings = () => {
      axios.get(`https://road-quest-server.onrender.com/my-bookings?email=${email}`)
        .then(response => {
          const processed = response.data.map(booking => ({
            ...booking,
            bookingDate: new Date(booking.bookingDate),
            endDate: new Date(booking.endDate),
            totalPrice: parseFloat(booking.totalPrice) || 0,
            status: booking.status || 'confirmed',
            duration: differenceInDays(
              new Date(booking.endDate),
              new Date(booking.bookingDate)
            ) + 1
          }));
          setBookings(processed);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load bookings');
          setLoading(false);
        });
    };

    email && fetchBookings();
  }, [email]);

  const getChartData = () => {
    const carPriceMap = new Map();
    
    bookings.forEach(booking => {
      const carModel = booking.carData.carModel;
      const dailyPrice = parseFloat(booking.carData.dailyRentalPrice);
      
      if (!carPriceMap.has(carModel)) {
        carPriceMap.set(carModel, {
          carModel,
          dailyPrice,
          count: 1
        });
      }
    });

    return Array.from(carPriceMap.values());
  };

  const chartData = getChartData();

  const handleCancel = () => {
    axios.patch(`https://road-quest-server.onrender.com/bookings/${selectedBooking?._id}`, { status: 'canceled' })
      .then(() => {
        setBookings(bookings.map(b => 
          b._id === selectedBooking?._id ? {...b, status: 'canceled'} : b
        ));
        setSelectedBooking(null);
      })
      .catch(console.error);
  };

  const handleDateChange = () => {
    const dailyPrice = parseFloat(selectedBooking?.carData?.dailyRentalPrice) || 0;
    const days = differenceInDays(newDates.end, newDates.start) + 1;
    const totalPrice = days * dailyPrice;

    axios.patch(`https://road-quest-server.onrender.com/bookings/${selectedBooking?._id}`, {
      bookingDate: newDates.start,
      endDate: newDates.end,
      totalPrice
    }).then(() => {
      setBookings(bookings.map(b => 
        b._id === selectedBooking?._id ? {
          ...b,
          bookingDate: newDates.start,
          endDate: newDates.end,
          totalPrice,
          duration: days
        } : b
      ));
      setSelectedBooking(null);
      setNewDates({ start: null, end: null });
    }).catch(console.error);
  };

  const formatDate = (date) => 
    date && !isNaN(date) ? format(date, 'dd MMM yyyy HH:mm') : 'N/A';

  if (loading) return <div className="text-center p-8">Loading bookings...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="animate__animated animate__fadeInUp p-4 md:p-6">
      {/* Price Chart Section */}
      <div className="mb-8 bg-white p-4 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-4">Car Daily Rental Prices</h2>
        <div className="h-64 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="carModel" 
                angle={-45} 
                textAnchor="end"
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="dailyPrice" 
                name="Daily Price ($)"
                fill="#2563eb" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Car', 'Details', 'Dates', 'Price', 'Status', 'Actions'].map((header, idx) => (
                <th key={idx} className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map(booking => (
              <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-4">
                    <img
                      src={booking?.carData?.imageUrl}
                      alt={booking?.carData?.carModel}
                      className="h-16 w-24 rounded-lg object-cover border"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/96';
                        e.target.className += ' bg-gray-100';
                      }}
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {booking.carData.carModel}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.carData.vehicleRegistrationNumber}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="space-y-1">
                    <div><span className="font-semibold">Location:</span> {booking.carData.location}</div>
                    <div><span className="font-semibold">Features:</span> {booking.carData.features.join(', ')}</div>
                  </div>
                </td>

                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="space-y-1">
                    <div><span className="font-semibold">From:</span> {formatDate(booking.bookingDate)}</div>
                    <div><span className="font-semibold">To:</span> {formatDate(booking.endDate)}</div>
                    <div>{booking.duration} days</div>
                  </div>
                </td>

                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="font-medium">
                    ${booking.totalPrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    (${parseFloat(booking.carData.dailyRentalPrice).toFixed(2)}/day)
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {booking.status}
                  </span>
                </td>

                <td className="px-4 py-3 space-y-2">
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setNewDates({
                        start: booking.bookingDate,
                        end: booking.endDate
                      });
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {bookings.map(booking => (
          <div key={booking._id} className="p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={booking?.carData?.imageUrl}
                alt={booking?.carData?.carModel}
                className="h-16 w-24 rounded-lg object-cover border"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/96';
                  e.target.className += ' bg-gray-100';
                }}
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {booking.carData.carModel}
                </div>
                <div className="text-sm text-gray-500">
                  {booking.carData.vehicleRegistrationNumber}
                </div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Location:</span> {booking.carData.location}
              </div>
              <div>
                <span className="font-semibold">Features:</span> {booking.carData.features.join(', ')}
              </div>
              <div>
                <span className="font-semibold">From:</span> {formatDate(booking.bookingDate)}
              </div>
              <div>
                <span className="font-semibold">To:</span> {formatDate(booking.endDate)}
              </div>
              <div>
                <span className="font-semibold">Duration:</span> {booking.duration} days
              </div>
              <div>
                <span className="font-semibold">Price:</span> ${booking.totalPrice.toFixed(2)}
                <span className="text-gray-500 text-xs"> (${parseFloat(booking.carData.dailyRentalPrice).toFixed(2)}/day)</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setSelectedBooking(booking);
                  setNewDates({
                    start: booking.bookingDate,
                    end: booking.endDate
                  });
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
              >
                Modify
              </button>
              <button
                onClick={() => setSelectedBooking(booking)}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {selectedBooking && !newDates.start && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Confirm Cancellation</h3>
            <p className="mb-4">Are you sure you want to cancel this booking?</p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
              >
                Go Back
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBooking && newDates.start && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Modify Booking Dates</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <DatePicker
                  selected={newDates.start}
                  onChange={date => setNewDates(prev => ({ ...prev, start: date }))}
                  minDate={new Date()}
                  showTimeSelect
                  dateFormat="dd MMM yyyy h:mm aa"
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <DatePicker
                  selected={newDates.end}
                  onChange={date => setNewDates(prev => ({ ...prev, end: date }))}
                  minDate={newDates.start}
                  showTimeSelect
                  dateFormat="dd MMM yyyy h:mm aa"
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setNewDates({ start: null, end: null });
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDateChange}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;