
import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [reports, setReports] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("reports");

  const fetchData = async () => {
    try {
      const [
        reportsResponse,
        workersResponse,
        feedbackResponse,
      ] = await Promise.all([
        API.get("/admin/reports"),
        API.get("/admin/workers"),
        API.get("/admin/feedback"),
      ]);

      setReports(reportsResponse.data);
      setWorkers(workersResponse.data);
      setFeedback(feedbackResponse.data);
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Failed to load admin data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignWorker = async (reportId, workerId) => {
    if (!workerId) return;

    try {
      await API.put("/admin/assign", {
        report_id: reportId,
        worker_id: Number(workerId),
      });

      setMessage("Worker assigned successfully!");
      await fetchData();
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Failed to assign worker"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const pendingReports = reports.filter(
    (report) => report.status?.toUpperCase() === "PENDING"
  ).length;

  const assignedReports = reports.filter(
    (report) =>
      ["ASSIGNED", "IN_PROGRESS"].includes(
        report.status?.toUpperCase()
      )
  ).length;

  const completedReports = reports.filter(
    (report) => report.status?.toUpperCase() === "COMPLETED"
  ).length;

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #edf8f0, #f8fffa)",
      color: "#172b4d",
      paddingBottom: "40px",
      fontFamily: "Arial, sans-serif",
    },

    navbar: {
      background: "linear-gradient(90deg, #146c43, #198754)",
      color: "white",
      padding: "18px 6%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "15px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    },

    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "35px 20px",
    },

    welcomeBanner: {
      background: "linear-gradient(135deg, #198754, #20c997)",
      color: "white",
      borderRadius: "22px",
      padding: "35px",
      marginBottom: "35px",
      boxShadow: "0 10px 25px rgba(25,135,84,0.18)",
    },

    card: {
      backgroundColor: "white",
      border: "1px solid #e1eee5",
      borderRadius: "18px",
      padding: "25px 20px",
      textAlign: "center",
      boxShadow: "0 7px 18px rgba(25,135,84,0.08)",
      cursor: "pointer",
    },

    contentBox: {
      backgroundColor: "white",
      borderRadius: "18px",
      padding: "28px",
      marginTop: "30px",
      boxShadow: "0 7px 18px rgba(25,135,84,0.08)",
      border: "1px solid #e1eee5",
    },

    logout: {
      backgroundColor: "white",
      color: "#198754",
      border: "none",
      borderRadius: "22px",
      padding: "11px 24px",
      fontWeight: "bold",
      cursor: "pointer",
    },

    sectionButton: (active) => ({
      padding: "12px 22px",
      border: "none",
      borderRadius: "22px",
      cursor: "pointer",
      backgroundColor: active ? "#198754" : "#dff3e6",
      color: active ? "white" : "#146c43",
      fontWeight: "bold",
    }),

    cell: {
      padding: "14px",
      borderBottom: "1px solid #e5e7eb",
      textAlign: "left",
      verticalAlign: "top",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "850px",
    },

    select: {
      padding: "9px",
      border: "1px solid #cedfd3",
      borderRadius: "8px",
      backgroundColor: "white",
      cursor: "pointer",
    },
  };

  const getStatusStyle = (status) => {
    const currentStatus = status?.toUpperCase();

    if (currentStatus === "COMPLETED") {
      return {
        backgroundColor: "#d1e7dd",
        color: "#0f5132",
      };
    }

    if (
      currentStatus === "ASSIGNED" ||
      currentStatus === "IN_PROGRESS"
    ) {
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
        fontWeight: "bold",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {status || "PENDING"}
    </span>
  );

  const renderReports = () => {
    if (reports.length === 0) {
      return (
        <p style={{ color: "#6c757d" }}>
          No reports available.
        </p>
      );
    }

    return (
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr
              style={{
                backgroundColor: "#146c43",
                color: "white",
              }}
            >
              <th style={styles.cell}>ID</th>
              <th style={styles.cell}>Waste Type</th>
              <th style={styles.cell}>Location</th>
              <th style={styles.cell}>Description</th>
              <th style={styles.cell}>Priority</th>
              <th style={styles.cell}>Status</th>
              <th style={styles.cell}>Assign Worker</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.report_id}>
                <td style={styles.cell}>
                  #{report.report_id}
                </td>

                <td style={styles.cell}>
                  {report.waste_type}
                </td>

                <td style={styles.cell}>
                  {report.location}
                </td>

                <td style={styles.cell}>
                  {report.description}
                </td>

                <td style={styles.cell}>
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        report.priority_level === "HIGH"
                          ? "#dc3545"
                          : "#6c757d",
                    }}
                  >
                    {report.priority_level || "MEDIUM"}
                  </span>
                </td>

                <td style={styles.cell}>
                  {renderStatus(report.status)}
                </td>

                <td style={styles.cell}>
                  {report.status?.toUpperCase() === "COMPLETED" ? (
                    <span
                      style={{
                        color: "#198754",
                        fontWeight: "bold",
                      }}
                    >
                      ✅ Completed
                    </span>
                  ) : report.status?.toUpperCase() === "ASSIGNED" ||
                    report.status?.toUpperCase() === "IN_PROGRESS" ? (
                    <span
                      style={{
                        color: "#b58105",
                        fontWeight: "bold",
                      }}
                    >
                      🚛 Assigned
                    </span>
                  ) : (
                    <select
                      defaultValue=""
                      onChange={(e) =>
                        assignWorker(
                          report.report_id,
                          e.target.value
                        )
                      }
                      style={styles.select}
                    >
                      <option value="">
                        Select Worker
                      </option>

                      {workers.map((worker) => (
                        <option
                          key={worker.user_id}
                          value={worker.user_id}
                        >
                          {worker.full_name}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFeedback = () => {
    if (feedback.length === 0) {
      return (
        <p style={{ color: "#6c757d" }}>
          No citizen feedback available.
        </p>
      );
    }

    return (
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr
              style={{
                backgroundColor: "#146c43",
                color: "white",
              }}
            >
              <th style={styles.cell}>Feedback ID</th>
              <th style={styles.cell}>Report ID</th>
              <th style={styles.cell}>Citizen ID</th>
              <th style={styles.cell}>Rating</th>
              <th style={styles.cell}>Message</th>
              <th style={styles.cell}>Date</th>
            </tr>
          </thead>

          <tbody>
            {feedback.map((item) => (
              <tr key={item.feedback_id}>
                <td style={styles.cell}>
                  #{item.feedback_id}
                </td>

                <td style={styles.cell}>
                  {item.report_id ?? "General"}
                </td>

                <td style={styles.cell}>
                  {item.user_id}
                </td>

                <td style={styles.cell}>
                  {"⭐".repeat(item.rating || 0)}
                </td>

                <td style={styles.cell}>
                  {item.message}
                </td>

                <td style={styles.cell}>
                  {item.created_at
                    ? new Date(
                        item.created_at
                      ).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div
          style={{
            fontSize: "22px",
            fontWeight: "bold",
          }}
        >
          🌿 Smart Waste Management
        </div>

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </nav>

      <div style={styles.container}>
        {/* WELCOME BANNER */}
        <div style={styles.welcomeBanner}>
          <h1 style={{ margin: "0 0 12px" }}>
            Welcome, {user.full_name || "Admin"}! 👋
          </h1>

          <p style={{ margin: 0, fontSize: "17px" }}>
            Manage waste complaints and coordinate collection
            activities.
          </p>
        </div>

        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <h2 style={{ color: "#146c43" }}>
            Admin Dashboard
          </h2>

          <p style={{ color: "#6c757d" }}>
            Monitor reports, workers, and citizen feedback
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={styles.card}
            onClick={() => setActiveSection("reports")}
          >
            <div style={{ fontSize: "38px" }}>📋</div>
            <h3>All Reports</h3>
            <p style={{ color: "#6c757d" }}>
              Total waste complaints
            </p>
            <h2 style={{ color: "#198754" }}>
              {reports.length}
            </h2>
          </div>

          <div
            style={styles.card}
            onClick={() => setActiveSection("reports")}
          >
            <div style={{ fontSize: "38px" }}>⏳</div>
            <h3>Pending</h3>
            <p style={{ color: "#6c757d" }}>
              Waiting for assignment
            </p>
            <h2 style={{ color: "#d39e00" }}>
              {pendingReports}
            </h2>
          </div>

          <div
            style={styles.card}
            onClick={() => setActiveSection("reports")}
          >
            <div style={{ fontSize: "38px" }}>🚛</div>
            <h3>Assigned</h3>
            <p style={{ color: "#6c757d" }}>
              Assigned or in progress
            </p>
            <h2 style={{ color: "#0d6efd" }}>
              {assignedReports}
            </h2>
          </div>

          <div
            style={styles.card}
            onClick={() => setActiveSection("reports")}
          >
            <div style={{ fontSize: "38px" }}>✅</div>
            <h3>Completed</h3>
            <p style={{ color: "#6c757d" }}>
              Finished collection work
            </p>
            <h2 style={{ color: "#198754" }}>
              {completedReports}
            </h2>
          </div>

          <div
            style={styles.card}
            onClick={() => setActiveSection("feedback")}
          >
            <div style={{ fontSize: "38px" }}>💬</div>
            <h3>Feedback</h3>
            <p style={{ color: "#6c757d" }}>
              Citizen feedback
            </p>
            <h2 style={{ color: "#dc3545" }}>
              {feedback.length}
            </h2>
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

        {/* SECTION BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "35px",
          }}
        >
          <button
            style={styles.sectionButton(activeSection === "reports")}
            onClick={() => setActiveSection("reports")}
          >
            📋 Waste Reports
          </button>

          <button
            style={styles.sectionButton(activeSection === "feedback")}
            onClick={() => setActiveSection("feedback")}
          >
            💬 Citizen Feedback
          </button>
        </div>

        {/* CONTENT */}
        <div style={styles.contentBox}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "30px" }}>
              <h3>⏳ Loading admin data...</h3>
              <p style={{ color: "#6c757d" }}>
                Please wait while the information is loaded.
              </p>
            </div>
          ) : activeSection === "reports" ? (
            <>
              <h2 style={{ color: "#146c43" }}>
                🗑️ Waste Complaint Management
              </h2>

              <p style={{ color: "#6c757d" }}>
                Review complaints and assign workers.
              </p>

              {renderReports()}
            </>
          ) : (
            <>
              <h2 style={{ color: "#146c43" }}>
                💬 Citizen Feedback
              </h2>

              <p style={{ color: "#6c757d" }}>
                Feedback received from citizens in your area.
              </p>

              {renderFeedback()}
            </>
          )}
        </div>

        {/* FOOTER */}
        <footer
          style={{
            textAlign: "center",
            marginTop: "45px",
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