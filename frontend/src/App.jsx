import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/LoginTemp.jsx";
import Register from "./pages/RegisterTemp.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/admindashboard.jsx";
import WorkerDashboard from "./pages/WorkerDashboard.jsx";

import MyReport from "./pages/myreport.jsx";
import PublicDashboard from "./pages/publicdashboard.jsx";
import ReportWaste from "./pages/reportwaste.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role?.toUpperCase();

  const renderDashboard = () => {
    if (role === "WORKER") {
      return <WorkerDashboard />;
    }

    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    return <Dashboard />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            <Login setAuth={setIsAuthenticated} />
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Citizen / Worker Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              renderDashboard()
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Worker Dashboard */}
        <Route
          path="/worker"
          element={
            <ProtectedRoute allowedRole="WORKER">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Other Pages */}
        <Route
          path="/publicdashboard"
          element={<PublicDashboard />}
        />

        <Route
          path="/reportwaste"
          element={<ReportWaste />}
        />

        <Route
          path="/myreport"
          element={<MyReport />}
        />

        {/* Unknown Page */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}