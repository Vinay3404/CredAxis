import React from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("credaxis_token");
  const role = localStorage.getItem("credaxis_role");

  if (!token) {
    return <Navigate to="/log-in" replace />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
