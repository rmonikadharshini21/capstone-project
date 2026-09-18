import React from "react";
import { useNavigate } from "react-router-dom";

function PublicDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const goToReportWaste = () => {
    navigate("/reportwaste");
  };

  const goToMyReports = () => {
    navigate("/myreport");
  };

  const handleTrackStatus = () => {
    navigate("/myreport");
  };

  const handleNotifications = () => {
    alert("Notifications will be added next.");
  };

  const handleFeedback = () => {
    alert("Feedback will be added next.");
  };

  return (
    <div className="min-vh-100 bg-light">

      <nav className="navbar navbar-dark bg-success px-4">
        <span className="navbar-brand fw-bold">
          Smart Waste Management
        </span>

        <button
          className="btn btn-light"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      <div className="container py-5">

        <div className="mb-4">
          <h2 className="fw-bold">
            Public Dashboard
          </h2>

          <p className="text-muted">
            Welcome to the Smart Waste Management System
          </p>
        </div>

        <div className="row g-4">

          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center p-4">
                <h4 className="fw-bold text-success">
                  Report Waste
                </h4>

                <p className="text-muted">
                  Report waste problems in your area.
                </p>

                <button
                  className="btn btn-success"
                  onClick={goToReportWaste}
                >
                  Report Waste
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center p-4">
                <h4 className="fw-bold text-primary">
                  My Reports
                </h4>

                <p className="text-muted">
                  View your submitted waste reports.
                </p>

                <button
                  className="btn btn-primary"
                  onClick={goToMyReports}
                >
                  View Reports
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center p-4">
                <h4 className="fw-bold text-warning">
                  Track Status
                </h4>

                <p className="text-muted">
                  Track your waste report status.
                </p>

                <button
                  className="btn btn-warning"
                  onClick={handleTrackStatus}
                >
                  Track Status
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center p-4">
                <h4 className="fw-bold text-info">
                  Notifications
                </h4>

                <p className="text-muted">
                  View updates about waste collection.
                </p>

                <button
                  className="btn btn-info text-white"
                  onClick={handleNotifications}
                >
                  View Notifications
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center p-4">
                <h4 className="fw-bold text-danger">
                  Feedback
                </h4>

                <p className="text-muted">
                  Give feedback about waste collection.
                </p>

                <button
                  className="btn btn-danger"
                  onClick={handleFeedback}
                >
                  Give Feedback
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PublicDashboard;