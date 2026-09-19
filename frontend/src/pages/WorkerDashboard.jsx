
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function WorkerDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await API.get("/worker/tasks");
      setTasks(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Failed to load assigned tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateTaskStatus = async (reportId, status) => {
    try {
      await API.put(
        `/worker/tasks/${reportId}/status?status=${status}`
      );

      setMessage("Task status updated successfully!");
      await fetchTasks();
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "Failed to update task status"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const assignedTasks = tasks.filter(
    (task) => task.status === "ASSIGNED"
  );

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  );

  const featureBoxStyle = {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "25px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#ffffff",
    boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  };

  const cellStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  };

  const renderTasks = (taskList) => {
    if (taskList.length === 0) {
      return <p>No tasks found.</p>;
    }

    return (
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={cellStyle}>Report ID</th>
              <th style={cellStyle}>Waste Type</th>
              <th style={cellStyle}>Location</th>
              <th style={cellStyle}>Description</th>
              <th style={cellStyle}>Status</th>
              <th style={cellStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {taskList.map((task) => (
              <tr key={task.report_id}>
                <td style={cellStyle}>{task.report_id}</td>
                <td style={cellStyle}>{task.waste_type}</td>
                <td style={cellStyle}>{task.location}</td>
                <td style={cellStyle}>{task.description}</td>
                <td style={cellStyle}>{task.status}</td>

                <td style={cellStyle}>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateTaskStatus(
                        task.report_id,
                        e.target.value
                      )
                    }
                    disabled={task.status === "COMPLETED"}
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                    }}
                  >
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="IN_PROGRESS">
                      IN PROGRESS
                    </option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
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
          <h2>Worker Dashboard</h2>

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

      <h3>Waste Collection Services</h3>

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
          onClick={() => setActiveSection("tasks")}
        >
          <h3>📋</h3>
          <h4>My Tasks</h4>
          <p>View all assigned tasks</p>
        </div>

        <div
          style={featureBoxStyle}
          onClick={() => setActiveSection("progress")}
        >
          <h3>📊</h3>
          <h4>Track Status</h4>
          <p>Update collection progress</p>
        </div>

        <div
          style={featureBoxStyle}
          onClick={() => setActiveSection("completed")}
        >
          <h3>✅</h3>
          <h4>Completed Tasks</h4>
          <p>View completed work</p>
        </div>

        <div
          style={featureBoxStyle}
          onClick={() => setActiveSection("assigned")}
        >
          <h3>🗑️</h3>
          <h4>Assigned Tasks</h4>
          <p>View new assignments</p>
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

      {loading && <p>Loading tasks...</p>}

      {!loading && activeSection === "tasks" && (
        <div style={{ marginTop: "30px" }}>
          <h3>My Tasks</h3>
          {renderTasks(tasks)}
        </div>
      )}

      {!loading && activeSection === "progress" && (
        <div style={{ marginTop: "30px" }}>
          <h3>Track Status</h3>
          {renderTasks(
            tasks.filter(
              (task) => task.status !== "COMPLETED"
            )
          )}
        </div>
      )}

      {!loading && activeSection === "completed" && (
        <div style={{ marginTop: "30px" }}>
          <h3>Completed Tasks</h3>
          {renderTasks(completedTasks)}
        </div>
      )}

      {!loading && activeSection === "assigned" && (
        <div style={{ marginTop: "30px" }}>
          <h3>Assigned Tasks</h3>
          {renderTasks(assignedTasks)}
        </div>
      )}
    </div>
  );
}