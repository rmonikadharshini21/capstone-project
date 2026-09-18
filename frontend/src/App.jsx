
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/LoginTemp.jsx";
import Register from "./pages/RegisterTemp.jsx";
import AdminDashboard from "./pages/admindashboard.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyReport from "./pages/myreport.jsx";
import PublicDashboard from "./pages/publicdashboard.jsx";
import ReportWaste from "./pages/reportwaste.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={<Login setAuth={setIsAuthenticated} />}
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/publicdashboard" element={<PublicDashboard />} />
        <Route path="/reportwaste" element={<ReportWaste />} />
        <Route path="/myreport" element={<MyReport />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}