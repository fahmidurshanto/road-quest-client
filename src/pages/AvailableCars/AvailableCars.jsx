import { useEffect, useState } from 'react';
import 'animate.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AvailableCars = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [cars, setCars ] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() =>{
    axios.get("https://road-quest-server.onrender.com/available-cars")
    .then(res => {
      setCars(res.data);
    })
    .catch(err => console.log(err))
  },[])

  const handleSortByChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    if (newSortBy === 'date') setSortOrder('desc');
    else setSortOrder('asc');
  };

  const filteredCars = cars.filter(car => 
    car.carData.carModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.carData.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === 'date') {
      const aTime = parseInt(a._id.substring(0, 8), 16) * 1000;
      const bTime = parseInt(b._id.substring(0, 8), 16) * 1000;
      return sortOrder === 'desc' ? bTime - aTime : aTime - bTime;
    }
    const aPrice = parseFloat(a.carData.dailyRentalPrice);
    const bPrice = parseFloat(b.carData.dailyRentalPrice);
    return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice;
  });

  return (
    <div className="container mx-auto p-4">
      {/* Controls Section */}
      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search cars..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>

          <div className="flex gap-4 flex-wrap">
            <select 
              value={sortBy}
              onChange={handleSortByChange}
              className="p-2 border rounded-lg"
            >
              <option value="date">Date Added</option>
              <option value="price">Price</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border rounded-lg"
            >
              {sortBy === 'date' ? (
                <>
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </>
              ) : (
                <>
                  <option value="asc">Lowest First</option>
                  <option value="desc">Highest First</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Cars Display */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'} gap-4`}>
        {sortedCars.map((car, index) => (
         <Link className='cursor-pointer' to={`/car/${car._id}`} key={car._id}>
           <div
            
            className={`animate__animated animate__fadeInUp bg-white rounded-xl shadow-md overflow-hidden ${
              viewMode === 'list' ? 'flex' : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img
              src={car.carData.imageUrl}
              alt={car.carData.carModel}
              className={`${viewMode === 'list' ? 'w-48 h-48' : 'w-full h-48'} object-cover`}
            />
            
            <div className="p-4 flex-1">
              <h3 className="text-xl font-bold mb-2">{car.carData.carModel}</h3>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-lg font-semibold text-blue-600">
                  ${car.carData.dailyRentalPrice}/day
                </span>
                <span className="text-sm text-gray-500">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  {car.carData.location}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {car.carData.features.slice(0, 3).map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
                Book Now
              </button>
            </div>
          </div>
         </Link>
        ))}
      </div>
    </div>
  );
};

export default AvailableCars;