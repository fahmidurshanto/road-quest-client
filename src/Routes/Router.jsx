import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import App from "../App";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import AddCarPage from "../pages/AddCarPage/AddCarPage";
import PrivateRoute from "./PrivateRoute";
import MyCars from "../pages/MyCars/MyCars";
import AvailableCars from "../pages/AvailableCars/AvailableCars";
import CarDetails from "../pages/CarDetails/CarDetails";
import MyBookings from "../pages/MyBookings/MyBookings";
import { AuthContext } from "../Providers/AuthProvider";
const router = createBrowserRouter([
    {
        path: '/',
        element: <App></App>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: "/",
                element: <Home></Home>
            },
            {
                path: "/login",
                element: <Login></Login>
            },
            {
                path: "/register",
                element: <Register></Register>
            },
            {
                path: "/add-car",
                element: <PrivateRoute> <AddCarPage></AddCarPage></PrivateRoute>
            },
            {
                path: '/my-cars',
                element: <PrivateRoute><MyCars></MyCars></PrivateRoute>
            },
            {
                path: "/available-cars",
                element: <AvailableCars></AvailableCars>
            },
            {
                path: "/car/:id",
                element: <PrivateRoute><CarDetails></CarDetails></PrivateRoute>,
                loader: ({params}) => fetch(`http://localhost:5000/car/${params.id}`)
            },
            {
                path: "/my-bookings",
                element: <PrivateRoute><MyBookings></MyBookings></PrivateRoute>,
            }
           
        ]
    }
])

export default router;