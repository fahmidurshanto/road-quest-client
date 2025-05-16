import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const redirectPath = location.state?.from?.pathname || "/";

  if (user) {
    // After successful login:
    navigate(redirectPath, { replace: true, state: { from: redirectPath } ,  });
    return children;
  } else {
    // After unsuccessful login:
    // navigate("/login", { replace: true });
    return <Navigate to="/login"></Navigate>
  }
};

export default PrivateRoute;