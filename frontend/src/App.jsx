import React from "react";

import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import PublicDashboard from "./pages/publicdashboard.jsx";
import ReportWaste from "./pages/reportwaste.jsx";
import MyReport from "./pages/myreport.jsx";
import AdminDashboard from "./pages/admindashboard.jsx";

function App() {
  const path = window.location.pathname;

  // Register
  if (path === "/register") {
    return <Register />;
  }

  // Public Dashboard
  if (path === "/dashboard") {
    return <PublicDashboard />;
  }

  // Report Waste
  if (path === "/reportwaste") {
    return <ReportWaste />;
  }

  // My Reports
  if (path === "/myreport") {
    return <MyReport />;
  }

  // Admin Dashboard
  if (path === "/admin") {
    return <AdminDashboard />;
  }

  // Default = Login
  return <Login />;
}

export default App;