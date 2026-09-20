
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
        err.response?.data?.detail || "Failed to submit report"
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
        err.response?.data?.detail || "Failed to submit feedback"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "28px 20px",
    textAlign: "center",
    cursor: "pointer",
    border: "1px solid #e4eee7",
    boxShadow: "0 8px 20px rgba(25, 135, 84, 0.08)",
    transition: "all 0.2s ease",
  };

  const sectionStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "28px",
    marginTop: "30px",
    boxShadow: "0 8px 20px rgba(25, 135, 84, 0.08)",
    border: "1px solid #e4eee7",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    margin: "8px 0 18px",
    border: "1px solid #cedfd3",
    borderRadius: "10px",
    boxSizing: "border-box",
    fontSize: "15px",
    outline: "none",
  };

  const primaryButtonStyle = {
    padding: "12px 22px",
    backgroundColor: "#198754",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  };

  const getStatusStyle = (status) => {
    const currentStatus = status?.toUpperCase();

    if (currentStatus === "COMPLETED") {
      return {
        backgroundColor: "#d1e7dd",
        color: "#0f5132",
      };
    }

    if (currentStatus === "IN_PROGRESS") {
      return {
        backgroundColor: "#cfe2ff",
        color: "#084298",
      };
    }

    if (currentStatus === "REJECTED") {
      return {
        backgroundColor: "#f8d7da",
        color: "#842029",
      };
    }

    return {
      backgroundColor: "#fff3cd",
      color: "#664d03",
    };
  };

  const renderStatus = (status) => (
    <span
      style={{
        ...getStatusStyle(status),
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        display: "inline-block",
      }}
    >
      {status || "PENDING"}
    </span>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #edf8f0, #f8fffa)",
        paddingBottom: "40px",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          background: "linear-gradient(90deg, #146c43, #198754)",
          color: "white",
          padding: "18px 6%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ fontSize: "21px", fontWeight: "700" }}>
          🌿 Smart Waste Management
        </div>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "white",
            color: "#198754",
            border: "none",
            borderRadius: "20px",
            padding: "10px 20px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </nav>

      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* WELCOME BANNER */}
        <div
          style={{
            background: "linear-gradient(135deg, #198754, #20c997)",
            color: "white",
            borderRadius: "22px",
            padding: "35px",
            marginBottom: "35px",
            boxShadow: "0 10px 25px rgba(25, 135, 84, 0.2)",
          }}
        >
          <h1 style={{ margin: "0 0 12px", fontSize: "32px" }}>
            Welcome, {user?.full_name || "Citizen"}! 👋
          </h1>

          <p style={{ margin: 0, fontSize: "17px" }}>
            Together, let's keep our environment clean and healthy. 🌍
          </p>
        </div>

        {/* HEADING */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <h2 style={{ color: "#146c43", marginBottom: "8px" }}>
            Waste Management Services
          </h2>

          <p style={{ color: "#6c757d" }}>
            Report waste problems and track your complaints
          </p>
        </div>

        {role === "CITIZEN" && (
          <>
            {/* SERVICE CARDS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "22px",
              }}
            >
              <div
                style={cardStyle}
                onClick={() => {
                  setActiveSection("report");
                  setMessage("");
                }}
              >
                <div style={{ fontSize: "42px", marginBottom: "12px" }}>
                  🗑️
                </div>

                <h3 style={{ color: "#198754" }}>Report Waste</h3>

                <p style={{ color: "#6c757d" }}>
                  Submit a new waste complaint
                </p>

                <button
                  style={primaryButtonStyle}
                  onClick={() => {
                    setActiveSection("report");
                    setMessage("");
                  }}
                >
                  Report Now →
                </button>
              </div>

              <div
                style={cardStyle}
                onClick={() => setActiveSection("reports")}
              >
                <div style={{ fontSize: "42px", marginBottom: "12px" }}>
                  📋
                </div>

                <h3 style={{ color: "#0d6efd" }}>My Reports</h3>

                <p style={{ color: "#6c757d" }}>
                  View your submitted reports
                </p>

                <button
                  style={{
                    ...primaryButtonStyle,
                    backgroundColor: "#0d6efd",
                  }}
                  onClick={() => setActiveSection("reports")}
                >
                  View Reports →
                </button>
              </div>

              <div
                style={cardStyle}
                onClick={() => setActiveSection("status")}
              >
                <div style={{ fontSize: "42px", marginBottom: "12px" }}>
                  📊
                </div>

                <h3 style={{ color: "#b58105" }}>Track Status</h3>

                <p style={{ color: "#6c757d" }}>
                  Check complaint progress
                </p>

                <button
                  style={{
                    ...primaryButtonStyle,
                    backgroundColor: "#d39e00",
                  }}
                  onClick={() => setActiveSection("status")}
                >
                  Track Status →
                </button>
              </div>

              <div
                style={cardStyle}
                onClick={() => {
                  setActiveSection("feedback");
                  setFeedbackStatus("");
                }}
              >
                <div style={{ fontSize: "42px", marginBottom: "12px" }}>
                  💬
                </div>

                <h3 style={{ color: "#dc3545" }}>Feedback</h3>

                <p style={{ color: "#6c757d" }}>
                  Share your service experience
                </p>

                <button
                  style={{
                    ...primaryButtonStyle,
                    backgroundColor: "#dc3545",
                  }}
                  onClick={() => {
                    setActiveSection("feedback");
                    setFeedbackStatus("");
                  }}
                >
                  Give Feedback →
                </button>
              </div>
            </div>

            {/* MESSAGE */}
            {message && (
              <div
                style={{
                  marginTop: "25px",
                  padding: "14px 18px",
                  borderRadius: "10px",
                  backgroundColor: message.includes("successfully")
                    ? "#d1e7dd"
                    : "#f8d7da",
                  color: message.includes("successfully")
                    ? "#0f5132"
                    : "#842029",
                }}
              >
                {message}
              </div>
            )}

            {/* REPORT WASTE */}
            {activeSection === "report" && (
              <div style={sectionStyle}>
                <h2 style={{ color: "#146c43" }}>
                  🗑️ Submit a New Waste Report
                </h2>

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
                    placeholder="Enter waste location"
                    style={inputStyle}
                  />

                  <label>Description:</label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows="5"
                    placeholder="Describe the waste problem"
                    style={inputStyle}
                  />

                  <button type="submit" style={primaryButtonStyle}>
                    Submit Report
                  </button>
                </form>
              </div>
            )}

            {/* REPORTS AND STATUS */}
            {(activeSection === "reports" ||
              activeSection === "status") && (
              <div style={sectionStyle}>
                <h2 style={{ color: "#146c43" }}>
                  {activeSection === "reports"
                    ? "📋 My Reports"
                    : "📊 Track Report Status"}
                </h2>

                {reports.length === 0 ? (
                  <p style={{ color: "#6c757d" }}>
                    No reports found.
                  </p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        minWidth:
                          activeSection === "status"
                            ? "950px"
                            : "600px",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#146c43",
                            color: "white",
                            textAlign: "left",
                          }}
                        >
                          <th style={{ padding: "14px" }}>ID</th>
                          <th style={{ padding: "14px" }}>Type</th>
                          <th style={{ padding: "14px" }}>Location</th>
                          <th style={{ padding: "14px" }}>AI Tag</th>
                          <th style={{ padding: "14px" }}>Priority</th>
                          <th style={{ padding: "14px" }}>Status</th>

                          {activeSection === "status" && (
                            <>
                              <th style={{ padding: "14px" }}>
                                Worker Name
                              </th>

                              <th style={{ padding: "14px" }}>
                                Worker Phone
                              </th>
                            </>
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {reports.map((report) => (
                          <tr
                            key={report.report_id}
                            style={{
                              borderBottom: "1px solid #e5e5e5",
                            }}
                          >
                            <td style={{ padding: "14px" }}>
                              {report.report_id}
                            </td>

                            <td style={{ padding: "14px" }}>
                              {report.waste_type}
                            </td>

                            <td style={{ padding: "14px" }}>
                              {report.location}
                            </td>

                            <td style={{ padding: "14px" }}>
                              {report.ai_category || "N/A"}
                            </td>

                            <td style={{ padding: "14px" }}>
                              {report.priority_level || "MEDIUM"}
                            </td>

                            <td style={{ padding: "14px" }}>
                              {renderStatus(report.status)}
                            </td>

                            {activeSection === "status" && (
                              <>
                                <td style={{ padding: "14px" }}>
                                  {report.worker_name || "Not assigned"}
                                </td>

                                <td style={{ padding: "14px" }}>
                                  {report.worker_phone || "Not available"}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* FEEDBACK */}
            {activeSection === "feedback" && (
              <div style={sectionStyle}>
                <h2 style={{ color: "#146c43" }}>
                  💬 Share Your Feedback
                </h2>

                <form onSubmit={handleSubmitFeedback}>
                  <label>Select Report (Optional):</label>

                  <select
                    value={feedbackReportId}
                    onChange={(e) => setFeedbackReportId(e.target.value)}
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
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    required
                    rows="5"
                    placeholder="Write your feedback here..."
                    style={inputStyle}
                  />

                  <button type="submit" style={primaryButtonStyle}>
                    Submit Feedback
                  </button>
                </form>

                {feedbackStatus && (
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "14px",
                      borderRadius: "10px",
                      backgroundColor: feedbackStatus.includes(
                        "successfully"
                      )
                        ? "#d1e7dd"
                        : "#f8d7da",
                      color: feedbackStatus.includes("successfully")
                        ? "#0f5132"
                        : "#842029",
                    }}
                  >
                    {feedbackStatus}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* FOOTER */}
        <footer
          style={{
            textAlign: "center",
            marginTop: "50px",
            color: "#6c757d",
            fontSize: "14px",
          }}
        >
          © 2026 Smart Waste Management System 🌿
        </footer>
      </div>
    </div>
  );
}