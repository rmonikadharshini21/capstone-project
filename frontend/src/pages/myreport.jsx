import React from "react";

function MyReport() {

  const loggedInEmail =
    localStorage.getItem("loggedInUserEmail");

  const allReports =
    JSON.parse(
      localStorage.getItem("wasteComplaints")
    ) || [];

  // Only show complaints belonging to current user
  const reports = allReports.filter((report) => {

    if (!report.userEmail) {
      return false;
    }

    return (
      report.userEmail.trim().toLowerCase() ===
      loggedInEmail?.trim().toLowerCase()
    );
  });

  const handleBack = () => {
    window.location.href = "/dashboard";
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
          onClick={handleBack}
        >
          Back to Dashboard
        </button>

      </nav>

      {/* Main Content */}

      <div className="container py-5">

        <div className="mb-4">

          <h2 className="fw-bold">
            My Reports
          </h2>

          <p className="text-muted">
            View the waste complaints you have submitted.
          </p>

          {loggedInEmail && (
            <p className="text-muted">
              Logged in as: <strong>{loggedInEmail}</strong>
            </p>
          )}

        </div>

        {reports.length === 0 ? (

          <div className="card shadow-sm">

            <div className="card-body text-center p-5">

              <h4 className="text-muted">
                No reports submitted yet.
              </h4>

              <p className="text-muted">
                Your waste complaints will appear here after you submit them.
              </p>

              <button
                className="btn btn-success"
                onClick={() => {
                  window.location.href = "/reportwaste";
                }}
              >
                Report Waste
              </button>

            </div>

          </div>

        ) : (

          <div className="row g-4">

            {reports.map((report, index) => (

              <div
                className="col-md-6"
                key={report.id || index}
              >

                <div className="card shadow-sm h-100">

                  <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                      <h4 className="fw-bold text-success">
                        Complaint #{index + 1}
                      </h4>

                      <span className="badge bg-warning text-dark">
                        {report.status || "Pending"}
                      </span>

                    </div>

                    <hr />

                    <p>
                      <strong>Complaint ID:</strong>{" "}
                      {report.id}
                    </p>

                    <p>
                      <strong>Complaint Type:</strong>{" "}
                      {report.complaintType}
                    </p>

                    <p>
                      <strong>Municipality ID:</strong>{" "}
                      {report.municipalityId}
                    </p>

                    <p>
                      <strong>Municipality Name:</strong>{" "}
                      {report.municipalityName}
                    </p>

                    <hr />

                    <p>
                      <strong>Location:</strong>
                      <br />
                      {report.location}
                    </p>

                    <p>
                      <strong>Nearby Landmark:</strong>{" "}
                      {report.landmark || "Not provided"}
                    </p>

                    <p>
                      <strong>Description:</strong>
                      <br />
                      {report.description}
                    </p>

                    <hr />

                    <h5 className="fw-bold text-success">
                      Contact Information
                    </h5>

                    <p>
                      <strong>Name:</strong>{" "}
                      {report.name}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {report.phone}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {report.email}
                    </p>

                    {report.date && (
                      <p>
                        <strong>Submitted Date:</strong>{" "}
                        {report.date}
                      </p>
                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyReport;