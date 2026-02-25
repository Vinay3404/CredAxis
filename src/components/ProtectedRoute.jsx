import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("credaxis_token");

  if (!token) {
    return <Navigate to="/log-in" replace />;
  }

  return children;
}

export default ProtectedRoute;
