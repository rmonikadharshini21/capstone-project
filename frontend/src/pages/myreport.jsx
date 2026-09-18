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

  return (
    <div className="min-vh-100 bg-light">

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

      <div className="container py-5">

        <h2 className="fw-bold">My Reports</h2>

        <p className="text-muted">
          View the waste complaints you have submitted.
        </p>

        {user && (
          <p className="text-muted">
            Logged in as: <strong>{user.email}</strong>
          </p>
        )}

        {loading && <p>Loading reports...</p>}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="card shadow-sm">
            <div className="card-body text-center p-5">

              <h4 className="text-muted">
                No reports submitted yet.
              </h4>

              <button
                className="btn btn-success"
                onClick={() => navigate("/dashboard")}
              >
                Report Waste
              </button>

            </div>
          </div>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="row g-4">

            {reports.map((report) => (
              <div
                className="col-md-6"
                key={report.report_id}
              >
                <div className="card shadow-sm h-100">

                  <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                      <h4 className="fw-bold text-success">
                        Report #{report.report_id}
                      </h4>

                      <span className="badge bg-warning text-dark">
                        {report.status || "PENDING"}
                      </span>

                    </div>

                    <hr />

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
                      {report.ai_category || "Not classified"}
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