import { Link } from 'react-router-dom';
import { useState } from 'react';
import 'animate.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              to="/available-cars" 
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 font-medium"
            >
              Available Cars
            </Link>
            <Link 
              to="/login" 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium"
            >
              Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 animate__animated animate__fadeIn">
            <div className="flex flex-col space-y-4 pb-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/available-cars" 
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 font-medium py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Available Cars
              </Link>
              <Link 
                to="/login" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;