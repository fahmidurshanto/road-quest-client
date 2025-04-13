import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import "animate.css";
import { AuthContext } from "../../Providers/AuthProvider";
import { useContext } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const { signIn, googleLogin, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    // Perform login logic here (e.g., API call)
    console.log("Logging in with:", { email, password });
    signIn(email, password)
      .then((res) => {
        res.json();
        setLoading(false);
      })
      .then((data) => console.log(data))
      .catch((error) => {
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

  const handleGoogleSignIn = (e) => {
    e.preventDefault();
    googleLogin()
      .then((res) => {
        console.log(res.user);
        const loggedUser = res.user;
        const name = loggedUser.displayName;
        const email = loggedUser.email;
        const photo = loggedUser.photoURL;
        const user = { name, email, photo };

        toast.success("Google sign-in successful!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((err) => {
        const errorMsg = err.message;
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4 animate__animated animate__fadeIn">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden animate__animated animate__zoomIn">
          {/* Header */}
          <div className="bg-indigo-600 py-6 px-8 text-center">
            <h1 className="text-3xl font-bold text-white animate__animated animate__fadeInDown cursor-default">
              Welcome Back
            </h1>
            <p className="text-indigo-100 mt-2 animate__animated animate__fadeIn animate__delay-1s cursor-default">
              Sign in to your Road Quest account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8">
            {/* Email Input */}
            <div className="mb-6 animate__animated animate__fadeIn animate__delay-2s">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2 cursor-pointer"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-300 cursor-text"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-6 animate__animated animate__fadeIn animate__delay-3s">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2 cursor-pointer"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-300 cursor-text"
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
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-300 cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 animate__animated animate__fadeIn animate__delay-5s cursor-pointer"
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="flex items-center my-6 animate__animated animate__fadeIn animate__delay-5s cursor-default">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-gray-200 animate__animated animate__fadeIn animate__delay-6s cursor-pointer"
            >
              <FcGoogle className="text-xl cursor-pointer" />
              Sign in with Google
            </button>

            {/* Sign Up Link */}
            <div className="mt-6 text-center animate__animated animate__fadeIn animate__delay-7s">
              <p className="text-gray-600 cursor-default">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-300 cursor-pointer"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Error Message Placeholder - Will be shown when auth fails */}
        <div className="mt-4 hidden">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative animate__animated animate__shakeX cursor-default">
            <span className="block sm:inline">
              Authentication failed. Please check your credentials.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
