
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MyReport() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await API.get("/waste/reports");
        setReports(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Failed to load reports"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-success";

      case "IN_PROGRESS":
        return "bg-primary";

      case "ASSIGNED":
        return "bg-info text-dark";

      case "PENDING":
        return "bg-warning text-dark";

      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="min-vh-100 bg-light">

      {/* NAVBAR */}

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

      {/* MAIN CONTENT */}

      <div className="container py-5">

        <h2 className="fw-bold">
          My Reports & Track Status
        </h2>

        <p className="text-muted">
          Track your waste reports and collection details.
        </p>

        {user && (
          <p className="text-muted">
            Logged in as: <strong>{user.email}</strong>
          </p>
        )}

        {/* LOADING */}

        {loading && (
          <div className="alert alert-info">
            Loading reports...
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* NO REPORTS */}

        {!loading &&
          !error &&
          reports.length === 0 && (
            <div className="card shadow-sm">
              <div className="card-body text-center p-5">

                <h4 className="text-muted">
                  No reports submitted yet.
                </h4>

                <button
                  className="btn btn-success"
                  onClick={() => navigate("/reportwaste")}
                >
                  Report Waste
                </button>

              </div>
            </div>
          )}

        {/* REPORT CARDS */}

        {!loading &&
          !error &&
          reports.length > 0 && (
            <div className="row g-4">

              {reports.map((report) => (
                <div
                  className="col-md-6"
                  key={report.report_id}
                >
                  <div className="card shadow-sm h-100">

                    <div className="card-body">

                      {/* REPORT HEADER */}

                      <div className="d-flex justify-content-between align-items-center mb-3">

                        <h4 className="fw-bold text-success">
                          Report #{report.report_id}
                        </h4>

                        <span
                          className={`badge ${getStatusClass(
                            report.status
                          )}`}
                        >
                          {report.status || "PENDING"}
                        </span>

                      </div>

                      <hr />

                      {/* REPORT DETAILS */}

                      <p>
                        <strong>Waste Type:</strong>{" "}
                        {report.waste_type}
                      </p>

                      <p>
                        <strong>Location:</strong>{" "}
                        {report.location}
                      </p>

                      <p>
                        <strong>Description:</strong>{" "}
                        {report.description}
                      </p>

                      <p>
                        <strong>AI Category:</strong>{" "}
                        {report.ai_category ||
                          "Not classified"}
                      </p>

                      <p>
                        <strong>Priority:</strong>{" "}
                        {report.priority_level || "MEDIUM"}
                      </p>

                      <p>
                        <strong>Status:</strong>{" "}
                        {report.status}
                      </p>

                      <p>
                        <strong>Submitted Date:</strong>{" "}
                        {report.created_at
                          ? new Date(
                              report.created_at
                            ).toLocaleString()
                          : "Not available"}
                      </p>

                      <hr />

                      {/* WORKER DETAILS */}

                      <h5 className="fw-bold text-primary">
                        👷 Worker Details
                      </h5>

                      <p>
                        <strong>Worker Name:</strong>{" "}
                        {report.worker_name ||
                          "Not assigned yet"}
                      </p>

                      <p>
                        <strong>Worker Phone:</strong>{" "}
                        {report.worker_phone ||
                          "Not available"}
                      </p>

                      <hr />

                      {/* ADMIN DETAILS */}

                      <h5 className="fw-bold text-success">
                        👨‍💼 Admin Details
                      </h5>

                      <p>
                        <strong>Admin Name:</strong>{" "}
                        {report.admin_name ||
                          "Not available"}
                      </p>

                      <p>
                        <strong>Admin Phone:</strong>{" "}
                        {report.admin_phone ||
                          "Not available"}
                      </p>

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