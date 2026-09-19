
import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [reports, setReports] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [reportsResponse, workersResponse] = await Promise.all([
        API.get("/admin/reports"),
        API.get("/admin/workers"),
      ]);

      setReports(reportsResponse.data);
      setWorkers(workersResponse.data);
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
      fetchData();
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
    (report) => report.status === "PENDING"
  ).length;

  const assignedReports = reports.filter(
    (report) => report.status === "ASSIGNED"
  ).length;

  const completedReports = reports.filter(
    (report) => report.status === "COMPLETED"
  ).length;

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Welcome, <strong>{user.full_name || "Admin"}</strong>
          </p>
        </div>

        <button
          onClick={logout}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <hr />

      <h2>Waste Management Services</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div className="dashboard-card">
          <div className="dashboard-icon">📋</div>
          <h2>All Reports</h2>
          <p>View all waste complaints</p>
          <h3>{reports.length}</h3>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">⏳</div>
          <h2>Pending Reports</h2>
          <p>Reports waiting for assignment</p>
          <h3>{pendingReports}</h3>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">🚛</div>
          <h2>Assigned Reports</h2>
          <p>Reports assigned to workers</p>
          <h3>{assignedReports}</h3>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">✅</div>
          <h2>Completed Reports</h2>
          <p>Completed waste collection</p>
          <h3>{completedReports}</h3>
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

      <h2 style={{ marginTop: "40px" }}>
        Waste Complaint Management
      </h2>

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ padding: "12px" }}>ID</th>
                <th style={{ padding: "12px" }}>Waste Type</th>
                <th style={{ padding: "12px" }}>Location</th>
                <th style={{ padding: "12px" }}>Description</th>
                <th style={{ padding: "12px" }}>Priority</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px" }}>Assign Worker</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report.report_id}>
                  <td style={{ padding: "12px" }}>
                    {report.report_id}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {report.waste_type}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {report.location}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {report.description}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {report.priority_level || "MEDIUM"}
                  </td>

                  <td style={{ padding: "12px" }}>
                    {report.status}
                  </td>

                  <td style={{ padding: "12px" }}>
                    <select
                      defaultValue=""
                      disabled={report.status === "ASSIGNED"}
                      onChange={(e) =>
                        assignWorker(
                          report.report_id,
                          e.target.value
                        )
                      }
                      style={{
                        padding: "8px",
                        borderRadius: "6px",
                      }}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>
        {`
          .dashboard-card {
            text-align: center;
            padding: 25px;
            border: 1px solid #ddd;
            border-radius: 15px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            background: white;
          }

          .dashboard-icon {
            font-size: 40px;
          }

          .dashboard-card h2 {
            margin: 10px 0;
          }

          .dashboard-card h3 {
            color: #0d6efd;
            font-size: 28px;
          }
        `}
      </style>
    </div>
  );
}