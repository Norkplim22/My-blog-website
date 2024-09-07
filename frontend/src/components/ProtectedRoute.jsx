/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";

function ProtectedRoute({ children }) {
  const { admin } = useContext(DataContext);

  // If admin is not logged in, redirect to login
  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  // If admin is logged in, render the requested route
  return children;
}

export default ProtectedRoute;
