import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import 'animate.css';

const Login = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4 animate__animated animate__fadeIn">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden animate__animated animate__zoomIn">
          {/* Header */}
          <div className="bg-indigo-600 py-6 px-8 text-center">
            <h1 className="text-3xl font-bold text-white animate__animated animate__fadeInDown">Welcome Back</h1>
            <p className="text-indigo-100 mt-2 animate__animated animate__fadeIn animate__delay-1s">
              Sign in to your Road Quest account
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Email Input */}
            <div className="mb-6 animate__animated animate__fadeIn animate__delay-2s">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-300"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-6 animate__animated animate__fadeIn animate__delay-3s">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-300"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-6 animate__animated animate__fadeIn animate__delay-4s">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 animate__animated animate__fadeIn animate__delay-5s"
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="flex items-center my-6 animate__animated animate__fadeIn animate__delay-5s">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-gray-200 animate__animated animate__fadeIn animate__delay-6s"
            >
              <FcGoogle className="text-xl" />
              Sign in with Google
            </button>

            {/* Sign Up Link */}
            <div className="mt-6 text-center animate__animated animate__fadeIn animate__delay-7s">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Error Message Placeholder - Will be shown when auth fails */}
        <div className="mt-4 hidden">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative animate__animated animate__shakeX">
            <span className="block sm:inline">Authentication failed. Please check your credentials.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;