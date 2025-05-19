import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { format, differenceInDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'animate.css';
import { AuthContext } from '../../Providers/AuthProvider';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDates, setNewDates] = useState({ start: null, end: null });
  const { user } = useContext(AuthContext);
  const email = user?.email;
  console.log("email from ", email)

  useEffect(() => {
    const fetchBookings = () => {
      axios.get(`http://localhost:5000/my-bookings?email=${email}`)
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

  const handleCancel = () => {
    axios.patch(`http://localhost:5000/bookings/${selectedBooking?._id}`, { status: 'canceled' })
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

    axios.patch(`http://localhost:5000/bookings/${selectedBooking?._id}`, {
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
      <div className="overflow-x-auto rounded-lg border shadow-sm">
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
                {/* Car Column */}
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

                {/* Details Column */}
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="space-y-1">
                    <div><span className="font-semibold">Location:</span> {booking.carData.location}</div>
                    <div><span className="font-semibold">Features:</span> {booking.carData.features.join(', ')}</div>
                  </div>
                </td>

                {/* Dates Column */}
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="space-y-1">
                    <div><span className="font-semibold">From:</span> {formatDate(booking.bookingDate)}</div>
                    <div><span className="font-semibold">To:</span> {formatDate(booking.endDate)}</div>
                    <div>{booking.duration} days</div>
                  </div>
                </td>

                {/* Price Column */}
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="font-medium">
                    ${booking.totalPrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    (${parseFloat(booking.carData.dailyRentalPrice).toFixed(2)}/day)
                  </div>
                </td>

                {/* Status Column */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {booking.status}
                  </span>
                </td>

                {/* Actions Column */}
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

      {/* Modals */}
      {selectedBooking && !newDates.start && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold mb-4">Confirm Cancellation</h3>
            <p className="mb-4">Are you sure you want to cancel this booking?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Go Back
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBooking && newDates.start && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
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
                  className="w-full p-2 border rounded-md"
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
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setNewDates({ start: null, end: null });
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDateChange}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
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