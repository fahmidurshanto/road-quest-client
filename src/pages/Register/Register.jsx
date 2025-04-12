import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import "animate.css";
import { useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import { signOut, updateProfile } from "firebase/auth";
import auth from "../../firebase/firebase.config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const { createUser, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(googleLogin)

  const handleRegister = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const photo = form.photoURL.value;
    
    createUser(email, password)
      .then((result) => {
        const user = result.user;
        
        // Show toast immediately
        toast.success("Registration successful! Updating profile...", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // update user profile
        return updateProfile(user, {
          displayName: name,
          photoURL: photo,
        });
      })
      .then(() => {
        

        // Sign out the user after 5 seconds
        setTimeout(() => {
          signOut(auth)
            .then(() => {
              console.log("User signed out successfully");
            })
            .catch((error) => {
              console.error("Error signing out:", error);
            });
        }, 5000);

        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  const handleGoogleSignIn = () => {
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4 animate__animated animate__fadeIn">
      <ToastContainer />
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden animate__animated animate__zoomIn">
          {/* Header */}
          <div className="bg-indigo-600 py-6 px-8 text-center">
            <h1 className="text-3xl font-bold text-white animate__animated animate__fadeInDown">
              Create Account
            </h1>
            <p className="text-indigo-100 mt-2 animate__animated animate__fadeIn animate__delay-1s">
              Join Road Quest today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="p-8">
            {/* Name Input */}
            <div className="mb-4 animate__animated animate__fadeIn animate__delay-2s">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-300"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email Input */}
            <div className="mb-4 animate__animated animate__fadeIn animate__delay-3s">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
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
            <div className="mb-4 animate__animated animate__fadeIn animate__delay-4s">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
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

            {/* Photo URL Input */}
            <div className="mb-6 animate__animated animate__fadeIn animate__delay-5s">
              <label
                htmlFor="photoURL"
                className="block text-gray-700 font-medium mb-2"
              >
                Profile Photo URL (Optional)
              </label>
              <input
                type="url"
                id="photoURL"
                name="photoURL"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-300"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 animate__animated animate__fadeIn animate__delay-6s"
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="flex items-center my-6 animate__animated animate__fadeIn animate__delay-7s">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-gray-200 animate__animated animate__fadeIn animate__delay-8s"
            >
              <FcGoogle className="text-xl" />
              Sign up with Google
            </button>

            {/* Login Link */}
            <div className="mt-6 text-center animate__animated animate__fadeIn animate__delay-9s">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;