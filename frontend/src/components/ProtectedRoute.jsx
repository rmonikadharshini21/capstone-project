
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  const user = userStr ? JSON.parse(userStr) : null;

  // 1. Check login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check user role
  const userRole = user.role?.toUpperCase();
  const requiredRole = allowedRole?.toUpperCase();

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Allow access
  return children;
}