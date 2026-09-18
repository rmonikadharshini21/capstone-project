import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // 1. Redirect unauthenticated users to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Redirect unauthorized roles
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Render page if authorized
  return children;
}