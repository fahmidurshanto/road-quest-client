import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { format, differenceInDays, parseISO } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'animate.css';
import { AuthContext } from '../../Providers/AuthProvider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaTrash, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [newDates, setNewDates] = useState({ start: null, end: null });
  const [isModifying, setIsModifying] = useState(false);
  const { user } = useContext(AuthContext);
  const email = user?.email;

  useEffect(() => {
    const fetchBookings = () => {
      axios.get(`http://localhost:5000/my-bookings?email=${email}`)
        .then(response => {
          const processed = response.data.map(booking => {
            const bookingDate = booking.bookingDate ? parseISO(booking.bookingDate) : new Date();
            const endDate = booking.endDate ? parseISO(booking.endDate) : new Date();
            return {
              ...booking,
              bookingDate,
              endDate,
              totalPrice: parseFloat(booking.totalPrice) || 0,
              status: booking.status || 'confirmed',
              duration: differenceInDays(
                endDate,
                bookingDate
              ) + 1,
              carData: booking.carData || { imageUrl: '', carModel: 'N/A', dailyRentalPrice: 0 }
            };
          });
          setBookings(processed);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching bookings:", err);
          setError('Failed to load bookings. Please try again later.');
          toast.error('Failed to load bookings.');
          setLoading(false);
        });
    };

    if (email) {
      fetchBookings();
    } else {
      setError('User email not found. Please log in.');
      setLoading(false);
    }
  }, [email]);

  // Prepare data for the chart
  const chartData = useMemo(() => {
    const carPriceMap = new Map();
    bookings.forEach(booking => {
      const carModel = booking.carData.carModel;
      const dailyPrice = parseFloat(booking.carData.dailyRentalPrice);
      
      if (carModel && !isNaN(dailyPrice) && !carPriceMap.has(carModel)) {
        carPriceMap.set(carModel, {
          carModel,
          dailyPrice,
        });
      }
    });
    return Array.from(carPriceMap.values());
  }, [bookings]);

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setSelectedBooking(null);
    setIsCancelModalOpen(false);
  };

  const openModifyModal = (booking) => {
    setSelectedBooking(booking);
    setNewDates({
      start: booking.bookingDate,
      end: booking.endDate
    });
    setIsModifyModalOpen(true);
  };

  const closeModifyModal = () => {
    setSelectedBooking(null);
    setIsModifyModalOpen(false);
    setNewDates({ start: null, end: null });
    setIsModifying(false);
  };

  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    axios.patch(`http://localhost:5000/bookings/${selectedBooking._id}`, { status: 'canceled' })
      .then(response => {
        setBookings(bookings.map(b =>
          b._id === selectedBooking._id ? { ...b, status: response.data.booking.status } : b
        ));
        closeCancelModal();
        toast.success("Booking canceled successfully.");
      })
      .catch(err => {
        toast.error(`Error canceling booking: ${err.response?.data?.error || err.message}`);
        console.error("Error canceling booking:", err);
      });
  };

  const handleModifyBookingDate = () => {
    if (!selectedBooking || !newDates.start || !newDates.end) {
      toast.warn("Please select both start and end dates.");
      return;
    }

    if (newDates.end <= newDates.start) {
      toast.error("End date must be after start date.");
      return;
    }

    const dailyPrice = parseFloat(selectedBooking.carData.dailyRentalPrice) || 0;
    const days = differenceInDays(newDates.end, newDates.start) + 1;
    
    if (days <= 0) {
      toast.error("Booking duration must be at least 1 day.");
      return;
    }
    
    const newTotalPrice = days * dailyPrice;
    setIsModifying(true);

    axios.patch(`http://localhost:5000/bookings/${selectedBooking._id}`, {
      bookingDate: newDates.start.toISOString(),
      endDate: newDates.end.toISOString(),
      totalPrice: newTotalPrice
    })
    .then(response => {
      const updatedBookingFromServer = response.data.booking;
      setBookings(bookings.map(b =>
        b._id === selectedBooking._id ? {
          ...b,
          bookingDate: parseISO(updatedBookingFromServer.bookingDate),
          endDate: parseISO(updatedBookingFromServer.endDate),
          totalPrice: parseFloat(updatedBookingFromServer.totalPrice),
          duration: differenceInDays(
            parseISO(updatedBookingFromServer.endDate),
            parseISO(updatedBookingFromServer.bookingDate)
          ) + 1,
          status: updatedBookingFromServer.status
        } : b
      ));
      closeModifyModal();
      toast.success("Booking dates modified successfully.");
    })
    .catch(err => {
      setIsModifying(false);
      
      // Handle 409 Conflict specifically
      if (err.response?.status === 409) {
        const conflictMessage = err.response.data?.conflict?.message || 
                              err.response.data?.error || 
                              "Car not available for selected dates";
        toast.error(conflictMessage);
      } 
      // Handle other errors
      else {
        const errorMessage = err.response?.data?.error || 
                            err.message || 
                            "Failed to modify booking";
        toast.error(`Error: ${errorMessage}`);
      }
      console.error("Error modifying booking:", err);
    });
  };

  const formatDateForDisplay = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return 'N/A';
    return format(date, 'dd MMM yyyy, h:mm a');
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="text-xl font-semibold">Loading bookings...</div></div>;
  if (error && !bookings.length) return <div className="text-center p-8 text-red-500 bg-red-100 border border-red-400 rounded-md">{error}</div>;
  if (!bookings.length && !loading) return <div className="text-center p-8 text-gray-600 text-xl">You have no bookings yet. 🚗</div>;

  const tableHeaders = ['Car Image', 'Car Model', 'Booking Date', 'Total Price', 'Booking Status', 'Actions'];

  return (
    <div className="animate__animated animate__fadeInUp p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center md:text-left">My Bookings</h1>
      
      {/* Data Visualization: Chart Section */}
      {chartData.length > 0 && (
        <div className="mb-10 bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 text-center">Car Daily Rental Prices Overview</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 20, left: -20, bottom: 45 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                <XAxis 
                  dataKey="carModel" 
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 10, fill: '#333' }} 
                />
                <YAxis tick={{ fontSize: 12, fill: '#333' }} unit="$"/>
                <Tooltip 
                  formatter={(value) => [`$${value.toFixed(2)}`, "Daily Price"]}
                  labelStyle={{ color: 'black', fontWeight: 'bold' }}
                  itemStyle={{ color: '#2563eb' }}
                  contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}
                />
                <Legend wrapperStyle={{paddingTop: '20px'}} />
                <Bar 
                  dataKey="dailyPrice" 
                  name="Daily Price"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-100">
            <tr>
              {tableHeaders.map((header) => (
                <th 
                  key={header} 
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking, index) => (
              <tr 
                key={booking._id} 
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50 transition-colors duration-150 ease-in-out`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={booking.carData.imageUrl}
                    alt={booking.carData.carModel}
                    className="h-16 w-24 rounded-md object-cover border border-gray-200 shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/96x64?text=Image+Error';
                      e.target.alt = 'Image loading error';
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.carData.carModel}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{formatDateForDisplay(booking.bookingDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">${booking.totalPrice.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openModifyModal(booking)}
                      disabled={booking.status === 'canceled'}
                      title="Modify booking dates"
                      className="text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium transition-colors"
                    >
                      <FaCalendarAlt className="mr-1.5 h-3.5 w-3.5" />
                      Modify Date
                    </button>
                    <button
                      onClick={() => openCancelModal(booking)}
                      disabled={booking.status === 'canceled'}
                      title="Cancel this booking"
                      className="text-white bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium transition-colors"
                    >
                      <FaTrash className="mr-1.5 h-3.5 w-3.5" />
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-5">
        {bookings.map(booking => (
          <div key={booking._id} className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={booking.carData.imageUrl || 'https://via.placeholder.com/80x54?text=No+Image'}
                alt={booking.carData.carModel}
                className="h-20 w-28 rounded-lg object-cover border shadow-sm"
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/80x54?text=Image+Error'; 
                }}
              />
              <div className="flex-1">
                <div className="text-lg font-semibold text-gray-800">{booking.carData.carModel}</div>
                <span className={`mt-1 px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="text-sm space-y-1.5 text-gray-700 mb-4">
              <p><strong className="font-medium text-gray-600">Booking Date:</strong> {formatDateForDisplay(booking.bookingDate)}</p>
              <p><strong className="font-medium text-gray-600">Total Price:</strong> <span className="font-semibold text-gray-800">${booking.totalPrice.toFixed(2)}</span></p>
            </div>

            <div className="mt-4 flex flex-col space-y-2">
              <button
                onClick={() => openModifyModal(booking)}
                disabled={booking.status === 'canceled'}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                <FaCalendarAlt className="mr-2 h-4 w-4" />
                Modify Date
              </button>
              <button
                onClick={() => openCancelModal(booking)}
                disabled={booking.status === 'canceled'}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                <FaTrash className="mr-2 h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out" onClick={closeCancelModal}>
          <div className="bg-white rounded-lg p-6 pt-5 w-full max-w-sm mx-auto shadow-xl transform transition-all duration-300 ease-in-out scale-100" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Confirm Cancellation</h3>
                <button onClick={closeCancelModal} className="text-gray-500 hover:text-gray-700 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <p className="mb-6 text-sm text-gray-600">Are you sure you want to cancel the booking for <strong className="font-medium text-gray-700">{selectedBooking.carData.carModel}</strong>?</p>
            <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
              <button
                onClick={closeCancelModal}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelBooking}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md border border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modify Booking Date Modal */}
      {isModifyModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out" onClick={closeModifyModal}>
          <div className="bg-white rounded-lg p-6 pt-5 w-full max-w-md mx-auto shadow-xl transform transition-all duration-300 ease-in-out scale-100" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-800">Modify Booking Dates</h3>
                <button onClick={closeModifyModal} className="text-gray-500 hover:text-gray-700 transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">For: <strong className="font-medium text-gray-700">{selectedBooking.carData.carModel}</strong></p>
            <div className="space-y-5">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                <DatePicker
                  id="startDate"
                  selected={newDates.start}
                  onChange={date => setNewDates(prev => ({ ...prev, start: date, end: (date && prev.end && date > prev.end) ? date : prev.end }))}
                  selectsStart
                  startDate={newDates.start}
                  endDate={newDates.end}
                  minDate={new Date()}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="dd MMM yyyy h:mm aa"
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select start date"
                  filterDate={date => date >= new Date().setHours(0,0,0,0)}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                <DatePicker
                  id="endDate"
                  selected={newDates.end}
                  onChange={date => setNewDates(prev => ({ ...prev, end: date }))}
                  selectsEnd
                  startDate={newDates.start}
                  endDate={newDates.end}
                  minDate={newDates.start || new Date()}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="dd MMM yyyy h:mm aa"
                  className="w-full p-2.5 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select end date"
                  disabled={!newDates.start}
                  filterDate={date => date >= (newDates.start || new Date())}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
              <button
                onClick={closeModifyModal}
                disabled={isModifying}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-75"
              >
                Cancel
              </button>
              <button
                onClick={handleModifyBookingDate}
                disabled={!newDates.start || !newDates.end || newDates.end <= newDates.start || isModifying}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md border border-transparent transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isModifying ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : "Confirm Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;