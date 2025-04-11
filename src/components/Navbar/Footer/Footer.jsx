import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import 'animate.css';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 animate__animated animate__fadeInUp">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Brand Info */}
          <div className="mb-8 md:mb-0 animate__animated animate__fadeInLeft">
            <div className="flex items-center space-x-2 mb-4">
              <Link to="/" className="text-3xl font-bold text-indigo-400 tracking-tight">
                ROAD QUEST
              </Link>
            </div>
            <p className="text-gray-400 max-w-md">
              Your premier destination for luxury car rentals. Experience the journey of a lifetime with our premium vehicles.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8 md:mb-0">
            <div className="animate__animated animate__fadeIn animate__delay-1s">
              <h3 className="text-lg font-semibold mb-4 text-indigo-300">Explore</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Home</Link></li>
                <li><Link to="/available-cars" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Cars</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Services</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">About Us</Link></li>
              </ul>
            </div>

            <div className="animate__animated animate__fadeIn animate__delay-2s">
              <h3 className="text-lg font-semibold mb-4 text-indigo-300">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/careers" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Careers</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Blog</Link></li>
                <li><Link to="/partners" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Partners</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Contact</Link></li>
              </ul>
            </div>

            <div className="animate__animated animate__fadeIn animate__delay-3s">
              <h3 className="text-lg font-semibold mb-4 text-indigo-300">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Privacy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Terms</Link></li>
                <li><Link to="/policy" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Policy</Link></li>
                <li><Link to="/licenses" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Licenses</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 transform hover:scale-110">
              <FaFacebook className="w-5 h-5 animate__animated animate__pulse animate__infinite animate__slower" />
            </Link>
            <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 transform hover:scale-110">
              <FaTwitter className="w-5 h-5 animate__animated animate__pulse animate__infinite animate__slower" />
            </Link>
            <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 transform hover:scale-110">
              <FaInstagram className="w-5 h-5 animate__animated animate__pulse animate__infinite animate__slower" />
            </Link>
            <Link to="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 transform hover:scale-110">
              <FaLinkedin className="w-5 h-5 animate__animated animate__pulse animate__infinite animate__slower" />
            </Link>
          </div>

          <p className="text-gray-500 text-sm animate__animated animate__fadeIn animate__delay-4s">
            &copy; {new Date().getFullYear()} Road Quest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;