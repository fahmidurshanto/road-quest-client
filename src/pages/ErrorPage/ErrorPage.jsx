import 'animate.css';
import { FaSadTear, FaHome, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 animate__animated animate__fadeIn">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl">
        <div className="p-8 text-center">
          {/* Animated 404 */}
          <div className="animate__animated animate__bounceIn">
            <span className="text-9xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              404
            </span>
          </div>

          {/* Animated Icon */}
          <div className="mt-2 animate__animated animate__flipInX animate__delay-1s">
            <FaSadTear className="w-20 h-20 mx-auto text-indigo-500 opacity-80" />
          </div>

          {/* Animated Title */}
          <h1 className="mt-4 text-3xl font-bold text-gray-800 animate__animated animate__fadeInUp animate__delay-1s">
            Oops! Lost in Space?
          </h1>

          {/* Animated Description */}
          <p className="mt-3 text-gray-600 animate__animated animate__fadeInUp animate__delay-2s">
            The page you're looking for doesn't exist or has been moved to another galaxy.
          </p>

          {/* Animated Buttons */}
          <div className="mt-8 flex justify-center gap-4 animate__animated animate__fadeInUp animate__delay-3s">
            <Link to="/">
            <button className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
              <FaHome />
              Go Home
            </button>
            </Link>
            <button className="cursor-pointer flex items-center gap-2 px-6 py-3 border border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
              <FaArrowLeft />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;