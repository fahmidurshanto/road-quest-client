import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [editingCar, setEditingCar] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/my-cars')
      .then(response => {
        console.log('Car data:', response.data);
        setCars(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
        toast.error('Failed to load cars');
      });
  }, []);

  const sortedCars = [...cars].sort((a, b) => {
    const priceA = parseFloat(a.carData.dailyRentalPrice);
    const priceB = parseFloat(b.carData.dailyRentalPrice);

    switch(sortOption) {
      case 'newest': return b._id.localeCompare(a._id);
      case 'oldest': return a._id.localeCompare(b._id);
      case 'price-low': return priceA - priceB;
      case 'price-high': return priceB - priceA;
      default: return 0;
    }
  });

  const handleUpdate = (updatedData) => {
    axios.put(`http://localhost:5000/my-cars/${editingCar._id}`, updatedData)
      .then(() => {
        setCars(cars.map(car => 
          car._id === editingCar._id ? { ...car, carData: { ...car.carData, ...updatedData } } : car
        ));
        setEditingCar(null);
        toast.success('Car updated successfully');
      })
      .catch(() => toast.error('Update failed'));
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:5000/my-cars/${deleteConfirm}`)
      .then(() => {
        setCars(cars.filter(car => car._id !== deleteConfirm));
        setDeleteConfirm(null);
        toast.success('Car deleted successfully');
      })
      .catch(() => toast.error('Deletion failed'));
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
      Error: {error}
    </div>
  );

  if (cars.length === 0) return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-bold mb-4">No cars found</h2>
      <a href="/add-car" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add New Car
      </a>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Your Cars</h1>
        <select 
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Model</th>
              <th className="px-4 py-3 text-left">Price/Day</th>
              <th className="px-4 py-3 text-left">Bookings</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Added Date</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedCars.map(car => (
              <tr key={car._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img 
                    src={car.carData.imageUrl} 
                    alt={car.carData.carModel}
                    className="w-16 h-10 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3 font-medium">{car.carData.carModel}</td>
                <td className="px-4 py-3">${car.carData.dailyRentalPrice}</td>
                <td className="px-4 py-3">{car.carData.bookingCount}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    car.carData.availability === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {car.carData.availability}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(parseInt(car.carData.user.createdAt)).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => setEditingCar(car)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(car._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-[1000] overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl my-8 relative">
            <button
              onClick={() => setEditingCar(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Car Details</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const updatedData = {
                carModel: formData.get('carModel'),
                dailyRentalPrice: formData.get('dailyRentalPrice'),
                availability: formData.get('availability'),
                vehicleRegistrationNumber: formData.get('registration'),
                features: formData.get('features').split(',').map(f => f.trim()),
                description: formData.get('description'),
                imageUrl: formData.get('imageUrl'),
                location: formData.get('location')
              };
              handleUpdate(updatedData);
            }}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block mb-2 font-medium">Car Model</label>
                  <input
                    name="carModel"
                    defaultValue={editingCar.carData.carModel}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Daily Price ($)</label>
                  <input
                    type="number"
                    name="dailyRentalPrice"
                    defaultValue={editingCar.carData.dailyRentalPrice}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Availability</label>
                  <select
                    name="availability"
                    defaultValue={editingCar.carData.availability}
                    className="w-full border rounded p-2"
                    required
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Registration Number</label>
                  <input
                    name="registration"
                    defaultValue={editingCar.carData.vehicleRegistrationNumber}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Features (comma separated)</label>
                  <input
                    name="features"
                    defaultValue={editingCar.carData.features.join(', ')}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingCar.carData.description}
                    className="w-full border rounded p-2"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    defaultValue={editingCar.carData.imageUrl}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Location</label>
                  <input
                    name="location"
                    defaultValue={editingCar.carData.location}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCar(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this car? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCars;