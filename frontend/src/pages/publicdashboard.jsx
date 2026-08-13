import React from "react";

function PublicDashboard() {
  const handleLogout = () => {
    window.location.href = "/";
  };

  const goToReportWaste = () => {
    window.location.href = "/reportwaste";
  };

  const goToMyReports = () => {
    window.location.href = "/myreport";
  };

  const handleTrackStatus = () => {
    alert("Status tracking will be added next.");
  };

  const handleNotifications = () => {
    alert("Notifications will be added next.");
  };

  const handleFeedback = () => {
    alert("Feedback will be added next.");
  };

  return (
    <div className="min-vh-100 bg-light">

      {/* Navbar */}
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

      {/* Dashboard */}
      <div className="container py-5">

        {/* Heading */}
        <div className="mb-4">
          <h2 className="fw-bold">
            Public Dashboard
          </h2>

          <p className="text-muted">
            Welcome to the Smart Waste Management System
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="row g-4">

          {/* Report Waste */}
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center p-4">

                <h4 className="fw-bold text-success">
                  Report Waste
                </h4>

                <p className="text-muted">
                  Report plastic, garbage, dead animals,
                  uncollected waste, or other waste problems.
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

          {/* My Reports */}
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center p-4">

                <h4 className="fw-bold text-primary">
                  My Reports
                </h4>

                <p className="text-muted">
                  View all the waste complaints you
                  have submitted.
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

          {/* Track Status */}
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center p-4">

                <h4 className="fw-bold text-warning">
                  Track Status
                </h4>

                <p className="text-muted">
                  Track the current status of your
                  waste collection requests.
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

          {/* Notifications */}
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center p-4">

                <h4 className="fw-bold text-info">
                  Notifications
                </h4>

                <p className="text-muted">
                  View updates and notifications about
                  your waste collection.
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

          {/* Feedback */}
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center p-4">

                <h4 className="fw-bold text-danger">
                  Feedback
                </h4>

                <p className="text-muted">
                  Give feedback about completed waste
                  collection services.
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