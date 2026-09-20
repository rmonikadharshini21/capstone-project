
import React from "react";
import { useNavigate } from "react-router-dom";

function PublicDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userName = user.full_name || user.name || "Citizen";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const dashboardCards = [
    {
      icon: "🗑️",
      title: "Report Waste",
      description: "Report waste problems in your area.",
      button: "Report Waste",
      color: "#198754",
      action: () => navigate("/reportwaste"),
    },
    {
      icon: "📋",
      title: "My Reports",
      description: "View all your submitted waste reports.",
      button: "View Reports",
      color: "#0d6efd",
      action: () => navigate("/myreport"),
    },
    {
      icon: "📊",
      title: "Track Status",
      description: "Track the progress of your waste reports.",
      button: "Track Status",
      color: "#d39e00",
      action: () => navigate("/myreport"),
    },
    {
      icon: "🔔",
      title: "Notifications",
      description: "View updates about waste collection.",
      button: "View Notifications",
      color: "#0dcaf0",
      action: () => alert("Notifications will be added next."),
    },
    {
      icon: "💬",
      title: "Feedback",
      description: "Share your feedback about waste collection.",
      button: "Give Feedback",
      color: "#dc3545",
      action: () => navigate("/feedback"),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8f5e9, #f8fff9)",
      }}
    >
      {/* Navigation Bar */}
      <nav
        className="navbar navbar-expand-lg px-4 py-3 shadow-sm"
        style={{
          background: "linear-gradient(90deg, #146c43, #198754)",
        }}
      >
        <div className="container-fluid">
          <span className="navbar-brand text-white fw-bold fs-4">
            🌿 Smart Waste Management
          </span>

          <button
            className="btn btn-light fw-semibold px-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        {/* Welcome Section */}
        <div
          className="p-4 p-md-5 mb-5 rounded-4 shadow-sm text-white"
          style={{
            background:
              "linear-gradient(135deg, #198754, #20c997)",
          }}
        >
          <h1 className="fw-bold">
            Welcome, {userName}! 👋
          </h1>

          <p className="mb-0 fs-5">
            Together, let's keep our environment clean and healthy. 🌍
          </p>
        </div>

        {/* Dashboard Heading */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">
            Citizen Dashboard
          </h2>

          <p className="text-muted">
            Manage your waste reports and services
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="row g-4">
          {dashboardCards.map((card, index) => (
            <div
              className="col-12 col-md-6 col-lg-4"
              key={index}
            >
              <div
                className="card border-0 rounded-4 h-100 shadow-sm"
                style={{
                  transition: "transform 0.2s ease",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "6px",
                    backgroundColor: card.color,
                  }}
                />

                <div className="card-body text-center p-4 d-flex flex-column">
                  <div
                    className="mb-3"
                    style={{
                      fontSize: "45px",
                    }}
                  >
                    {card.icon}
                  </div>

                  <h4 className="fw-bold mb-3">
                    {card.title}
                  </h4>

                  <p className="text-muted flex-grow-1">
                    {card.description}
                  </p>

                  <button
                    className="btn text-white fw-semibold rounded-pill px-4 py-2"
                    style={{
                      backgroundColor: card.color,
                      border: "none",
                    }}
                    onClick={card.action}
                  >
                    {card.button} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Information Section */}
        <div
          className="mt-5 p-4 rounded-4 shadow-sm text-center"
          style={{
            backgroundColor: "#ffffff",
            borderLeft: "5px solid #198754",
          }}
        >
          <h5 className="fw-bold text-success">
            🌱 Make Your Area Cleaner
          </h5>

          <p className="text-muted mb-0">
            Report waste issues and help your municipality
            maintain a cleaner environment.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-muted">
        <small>
          © 2026 Smart Waste Management System | Keep It Clean 🌿
        </small>
      </footer>
    </div>
  );
}

export default PublicDashboard;