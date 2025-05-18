import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'animate.css';
import Modal from '../../components/Modal/Modal';
import { AuthContext } from "../../Providers/AuthProvider";

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [editingCar, setEditingCar] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.email) return;
    
    setLoading(true);
    axios
      .get(`http://localhost:5000/my-cars?email=${user.email}`)
      .then((response) => {
        setCars(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        toast.error("Failed to load cars");
      });
  }, [user]);

  const sortedCars = [...cars].sort((a, b) => {
    const priceA = parseFloat(a.carData.dailyRentalPrice);
    const priceB = parseFloat(b.carData.dailyRentalPrice);

    switch (sortOption) {
      case "newest":
        return b._id.localeCompare(a._id);
      case "oldest":
        return a._id.localeCompare(b._id);
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      default:
        return 0;
    }
  });

  const handleUpdate = (updatedData) => {
    axios
      .put(`http://localhost:5000/my-cars/${editingCar._id}`, updatedData)
      .then(() => {
        setCars(
          cars.map((car) =>
            car._id === editingCar._id
              ? { ...car, carData: { ...car.carData, ...updatedData } }
              : car
          )
        );
        setEditingCar(null);
        toast.success("Car updated successfully");
      })
      .catch(() => toast.error("Update failed"));
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/my-cars/${deleteConfirm}`)
      .then(() => {
        setCars(cars.filter((car) => car._id !== deleteConfirm));
        setDeleteConfirm(null);
        toast.success("Car deleted successfully");
      })
      .catch(() => toast.error("Deletion failed"));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 animate__animated animate__fadeIn">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded animate__animated animate__fadeIn">
      Error: {error}
    </div>
  );

  if (cars.length === 0 && !loading)
    return (
      <div className="text-center py-10 animate__animated animate__fadeIn">
      <h2 className="text-2xl font-bold mb-4">No cars found</h2>
        <a
          href="/add-car"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
        Add New Car
      </a>
    </div>
  );

  return (
    <div className="container mx-auto p-4 animate__animated animate__fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Manage Your Cars</h1>
        <select 
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded px-4 py-2 md:px-3 md:py-1 w-full md:w-auto"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      <div className="w-full">
        <div className="md:hidden space-y-4 p-2 sm:p-4">
          {sortedCars.map((car, index) => (
            <div 
              key={car._id + '-mobile'} 
              className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow duration-200 animate__animated animate__fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={car?.carData?.imageUrl}
                  alt={car?.carData?.carModel}
                  className="w-full sm:w-24 h-24 sm:h-16 object-cover rounded mb-3 sm:mb-0 self-center sm:self-start"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{car?.carData?.carModel}</h3>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full mb-2 ${
                      car?.carData?.availability === "available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {car?.carData?.availability}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Price/Day:</span>
                  <span>${car?.carData?.dailyRentalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Bookings:</span>
                  <span>{car?.carData?.bookingCount === undefined ? 'N/A' : car?.carData?.bookingCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Added:</span>
                  <span>
                    {new Date(
                      parseInt(car?.carData?.user?.createdAt)
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setEditingCar(car)}
                  className="w-full sm:w-auto flex-grow bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm font-medium transition-colors duration-150"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(car._id)}
                  className="w-full sm:w-auto flex-grow bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm font-medium transition-colors duration-150"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block">
          <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50">
            <tr>
                <th className="px-2 md:px-4 py-3 text-left text-sm md:text-base">Image</th>
                <th className="px-2 md:px-4 py-3 text-left text-sm md:text-base">Model</th>
                <th className="px-2 md:px-4 py-3 text-left text-sm md:text-base">Price/Day</th>
                <th className="px-2 md:px-4 py-3 text-left text-sm md:text-base">Bookings</th>
                <th className="px-2 md:px-4 py-3 text-left text-sm md:text-base">Status</th>
                <th className="px-2 md:px-4 py-3 text-left text-sm md:text-base">Added Date</th>
                <th className="px-2 md:px-4 py-3 text-left text-sm md:text-base">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
              {sortedCars.map((car, index) => (
                <tr 
                  key={car._id + '-desktop'} 
                  className="hover:bg-gray-50 animate__animated animate__fadeInUp"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="px-2 md:px-4 py-3 align-middle">
                  <img 
                    src={car?.carData?.imageUrl} 
                    alt={car?.carData?.carModel}
                      className="w-12 h-8 md:w-16 md:h-10 object-cover rounded"
                  />
                </td>
                  <td className="px-2 md:px-4 py-3 font-medium text-sm md:text-base align-middle">
                    {car?.carData?.carModel}
                  </td>
                  <td className="px-2 md:px-4 py-3 text-sm md:text-base align-middle">
                    ${car?.carData?.dailyRentalPrice}
                  </td>
                  <td className="px-2 md:px-4 py-3 text-sm md:text-base align-middle">
                    {car?.carData?.bookingCount === undefined ? 'N/A' : car.carData.bookingCount}
                  </td>
                  <td className="px-2 md:px-4 py-3 align-middle">
                    <span
                      className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                        car?.carData?.availability === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                    {car?.carData?.availability}
                  </span>
                </td>
                  <td className="px-2 md:px-4 py-3 text-sm md:text-base align-middle">
                    {new Date(
                      parseInt(car?.carData?.user?.createdAt)
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                  })}
                </td>
                  <td className="px-2 md:px-4 py-3 align-middle">
                    <div className="flex flex-col lg:flex-row gap-2">
                  <button
                    onClick={() => setEditingCar(car)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm md:text-base w-full lg:w-auto"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(car._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm md:text-base w-full lg:w-auto"
                  >
                    Delete
                  </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editingCar} onClose={() => setEditingCar(null)} type="edit">
        <h2 className="text-xl font-bold mb-4">Edit Car Details</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updatedData = {
              carModel: formData.get("carModel"),
              dailyRentalPrice: formData.get("dailyRentalPrice"),
              availability: formData.get("availability"),
              vehicleRegistrationNumber: formData.get("registration"),
              features: formData
                .get("features")
                .split(",")
                .map((f) => f.trim()),
              description: formData.get("description"),
              imageUrl: formData.get("imageUrl"),
              location: formData.get("location"),
            };
            handleUpdate(updatedData);
          }}
        >
          <div className="space-y-4 mb-6">
            <div>
              <label className="block mb-2 font-medium">Car Model</label>
              <input
                name="carModel"
                defaultValue={editingCar?.carData.carModel}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Daily Price ($)
              </label>
              <input
                type="number"
                name="dailyRentalPrice"
                defaultValue={editingCar?.carData.dailyRentalPrice}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Availability</label>
              <select
                name="availability"
                defaultValue={editingCar?.carData.availability}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Registration Number
              </label>
              <input
                name="registration"
                defaultValue={editingCar?.carData.vehicleRegistrationNumber}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Features (comma separated)
              </label>
              <input
                name="features"
                defaultValue={editingCar?.carData.features ? editingCar.carData.features.join(", ") : ""}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Description</label>
              <textarea
                name="description"
                defaultValue={editingCar?.carData.description}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                defaultValue={editingCar?.carData.imageUrl}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Location</label>
              <input
                name="location"
                defaultValue={editingCar?.carData.location}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingCar(null)}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} type="delete">
        <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete this car? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
          >
            Confirm Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MyCars;