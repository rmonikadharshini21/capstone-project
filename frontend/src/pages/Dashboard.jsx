
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || "CITIZEN";

  const [activeSection, setActiveSection] = useState("");
  const [reports, setReports] = useState([]);

  const [wasteType, setWasteType] = useState("Plastic");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const [feedbackReportId, setFeedbackReportId] = useState("");
  const [rating, setRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("");

  const fetchReports = async () => {
    try {
      const response = await API.get("/waste/reports");
      setReports(response.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
      setMessage("Failed to load reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCreateReport = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("/waste/report", {
        waste_type: wasteType,
        location,
        description,
      });

      setMessage("Report submitted successfully!");

      setLocation("");
      setDescription("");

      await fetchReports();
      setActiveSection("reports");
    } catch (err) {
      setMessage(
        err.response?.data?.detail ||
          "Failed to submit report"
      );
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setFeedbackStatus("");

    if (!feedbackMessage.trim()) {
      setFeedbackStatus("Please enter your feedback message.");
      return;
    }

    try {
      await API.post("/waste/feedback", {
        report_id: feedbackReportId
          ? Number(feedbackReportId)
          : null,
        rating: Number(rating),
        message: feedbackMessage,
      });

      setFeedbackStatus("Feedback submitted successfully!");
      setFeedbackReportId("");
      setRating(5);
      setFeedbackMessage("");
    } catch (err) {
      setFeedbackStatus(
        err.response?.data?.detail ||
          "Failed to submit feedback"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const featureBoxStyle = {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "25px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0 15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h2>Citizen Dashboard</h2>

          {user && (
            <p>
              Welcome, <strong>{user.full_name}</strong>
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 18px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {role === "CITIZEN" && (
        <>
          <h3>Waste Management Services</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div
              style={featureBoxStyle}
              onClick={() => {
                setActiveSection("report");
                setMessage("");
              }}
            >
              <h3>📋</h3>
              <h4>Report Waste</h4>
              <p>Submit a new waste complaint</p>
            </div>

            <div
              style={featureBoxStyle}
              onClick={() => setActiveSection("reports")}
            >
              <h3>📄</h3>
              <h4>My Reports</h4>
              <p>View your submitted reports</p>
            </div>

            <div
              style={featureBoxStyle}
              onClick={() => setActiveSection("status")}
            >
              <h3>📊</h3>
              <h4>Track Status</h4>
              <p>Check complaint progress</p>
            </div>

            <div
              style={featureBoxStyle}
              onClick={() => {
                setActiveSection("feedback");
                setFeedbackStatus("");
              }}
            >
              <h3>💬</h3>
              <h4>Feedback</h4>
              <p>Share your service experience</p>
            </div>
          </div>

          {message && (
            <p
              style={{
                color: message.includes("successfully")
                  ? "green"
                  : "red",
                marginTop: "20px",
              }}
            >
              {message}
            </p>
          )}

          {activeSection === "report" && (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginTop: "30px",
              }}
            >
              <h3>Submit a New Waste Report</h3>

              <form onSubmit={handleCreateReport}>
                <label>Waste Type:</label>

                <select
                  value={wasteType}
                  onChange={(e) => setWasteType(e.target.value)}
                  style={inputStyle}
                >
                  <option value="Plastic">Plastic</option>
                  <option value="Organic">Organic</option>
                  <option value="Hazardous">Hazardous</option>
                  <option value="E-Waste">E-Waste</option>
                </select>

                <label>Location:</label>

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  style={inputStyle}
                />

                <label>Description:</label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  style={inputStyle}
                />

                <button
                  type="submit"
                  style={{
                    padding: "10px 18px",
                    backgroundColor: "#38a169",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Submit Report
                </button>
              </form>
            </div>
          )}

          {(activeSection === "reports" ||
            activeSection === "status") && (
            <div style={{ marginTop: "30px" }}>
              <h3>
                {activeSection === "reports"
                  ? "My Reports"
                  : "Track Report Status"}
              </h3>

              {reports.length === 0 ? (
                <p>No reports found.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#f2f2f2",
                          textAlign: "left",
                        }}
                      >
                        <th>ID</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>AI Tag</th>
                        <th>Priority</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {reports.map((report) => (
                        <tr key={report.report_id}>
                          <td>{report.report_id}</td>
                          <td>{report.waste_type}</td>
                          <td>{report.location}</td>
                          <td>{report.ai_category || "N/A"}</td>
                          <td>
                            {report.priority_level || "MEDIUM"}
                          </td>
                          <td>{report.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeSection === "feedback" && (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginTop: "30px",
              }}
            >
              <h3>Share Your Feedback</h3>

              <form onSubmit={handleSubmitFeedback}>
                <label>Select Report (Optional):</label>

                <select
                  value={feedbackReportId}
                  onChange={(e) =>
                    setFeedbackReportId(e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="">General Feedback</option>

                  {reports
                    .filter(
                      (report) =>
                        report.status?.toUpperCase() === "COMPLETED"
                    )
                    .map((report) => (
                      <option
                        key={report.report_id}
                        value={report.report_id}
                      >
                        Report #{report.report_id} -{" "}
                        {report.waste_type}
                      </option>
                    ))}
                </select>

                <label>Rating:</label>

                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  style={inputStyle}
                >
                  <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                  <option value="4">⭐⭐⭐⭐ - Good</option>
                  <option value="3">⭐⭐⭐ - Average</option>
                  <option value="2">⭐⭐ - Poor</option>
                  <option value="1">⭐ - Very Poor</option>
                </select>

                <label>Feedback Message:</label>

                <textarea
                  value={feedbackMessage}
                  onChange={(e) =>
                    setFeedbackMessage(e.target.value)
                  }
                  required
                  rows="5"
                  placeholder="Write your feedback here..."
                  style={inputStyle}
                />

                <button
                  type="submit"
                  style={{
                    padding: "10px 18px",
                    backgroundColor: "#38a169",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Submit Feedback
                </button>
              </form>

              {feedbackStatus && (
                <p
                  style={{
                    color: feedbackStatus.includes("successfully")
                      ? "green"
                      : "red",
                    marginTop: "15px",
                  }}
                >
                  {feedbackStatus}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}