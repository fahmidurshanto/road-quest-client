import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import 'animate.css';
import { FiMenu, FiX } from 'react-icons/fi';
import { AuthContext } from '../../Providers/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, setLoading } = useContext(AuthContext); // Assuming your AuthContext provides logOut function

  const handleLogout = () => {
    logout()
      .then(() => {
        // Optional: Add toast notification or other feedback
        toast.success("Logged out successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setLoading(false);})
      .catch(error => {
        const errorMsg = error.message;  
        const splittedErr = errorMsg
          .split(/,|FirebaseError:|Firebase:/)
          .map((part) => part.trim())
          .filter((part) => part.length > 0);
        const finalError = splittedErr.join(" "); // Join with spaces instead of commas
        toast(finalError);
        setLoading(false);
      });
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 animate__animated animate__fadeInDown">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand Name */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 animate__animated animate__pulse animate__infinite"
          >
            <span className="text-3xl font-bold text-indigo-600 tracking-tight">ROAD QUEST</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 font-medium"
            >
              Home
            </Link>
            <Link 
              to="/availableCars" 
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 font-medium"
            >
              Available Cars
            </Link>

            {/* Conditional rendering for authenticated users */}
            {user ? (
              <>
                <Link 
                  to="/add-car" 
                  className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 font-medium"
                >
                  Add Car
                </Link>
                <Link 
                  to="/my-cars" 
                  className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 font-medium"
                >
                  My Cars
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className=" cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 focus:outline-none transition-transform duration-300 hover:scale-110"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6 animate__animated animate__flipInX" />
              ) : (
                <FiMenu className="w-6 h-6 animate__animated animate__flipInX" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className={`mt-4 animate__animated ${isMobileMenuOpen ? 'animate__fadeInDown' : 'animate__fadeOutUp'}`}>
            <div className="flex flex-col space-y-4 pb-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-indigo-600 transition-all duration-300 font-medium py-2 border-b border-gray-100 hover:pl-2 hover:bg-indigo-50 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/available-cars" 
                className="text-gray-700 hover:text-indigo-600 transition-all duration-300 font-medium py-2 border-b border-gray-100 hover:pl-2 hover:bg-indigo-50 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Available Cars
              </Link>

              {/* Conditional rendering for authenticated users (mobile) */}
              {user ? (
                <>
                  <Link 
                    to="/add-car" 
                    className="text-gray-700 hover:text-indigo-600 transition-all duration-300 font-medium py-2 border-b border-gray-100 hover:pl-2 hover:bg-indigo-50 rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Add Car
                  </Link>
                  <Link 
                    to="/my-cars" 
                    className="text-gray-700 hover:text-indigo-600 transition-all duration-300 font-medium py-2 border-b border-gray-100 hover:pl-2 hover:bg-indigo-50 rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Cars
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition-all duration-300 font-medium text-center hover:scale-105 transform"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-indigo-600 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-indigo-700 transition-all duration-300 font-medium text-center hover:scale-105 transform"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </header>
  );
};

export default Navbar;