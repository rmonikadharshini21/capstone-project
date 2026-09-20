
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [tasks, setTasks] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const getErrorMessage = (error, defaultMessage) => {
    const detail = error.response?.data?.detail;

    if (typeof detail === "string") return detail;

    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg || "Validation error").join(", ");
    }

    return defaultMessage;
  };

  const fetchTasks = async () => {
    try {
      const response = await API.get("/worker/tasks");
      setTasks(response.data);
    } catch (error) {
      setMessage(getErrorMessage(error, "Failed to load assigned tasks"));
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    setFeedbackLoading(true);

    try {
      const response = await API.get("/worker/feedback");
      setFeedback(response.data);
    } catch {
      setFeedback([]);
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchFeedback();
  }, []);

  const decideAssignment = async (reportId, decision) => {
    let rejectionReason = null;

    if (decision === "REJECT") {
      rejectionReason = window.prompt(
        "Enter the reason for rejecting this assignment:"
      );

      if (!rejectionReason?.trim()) {
        setMessage("Rejection reason is required.");
        return;
      }
    }

    try {
      await API.put(`/worker/tasks/${reportId}/decision`, {
        decision,
        rejection_reason: rejectionReason,
      });

      setMessage(
        decision === "ACCEPT"
          ? "Assignment accepted successfully!"
          : "Assignment rejected successfully!"
      );

      await fetchTasks();
    } catch (error) {
      setMessage(getErrorMessage(error, "Failed to update assignment"));
    }
  };

  const updateTaskStatus = async (reportId, status) => {
    try {
      await API.put(
        `/worker/tasks/${reportId}/status?new_status=${encodeURIComponent(status)}`
      );

      setMessage("Task status updated successfully!");
      await fetchTasks();
    } catch (error) {
      setMessage(getErrorMessage(error, "Failed to update task status"));
    }
  };

  const requestExtension = async (task) => {
    if (task.status === "COMPLETED") {
      setMessage("Completed tasks cannot request an extension.");
      return;
    }

    if (task.assignment_status !== "ACCEPTED") {
      setMessage("Accept the assignment before requesting extension.");
      return;
    }

    if (task.extension_status === "PENDING") {
      setMessage("An extension request is already pending.");
      return;
    }

    if (task.extension_status === "APPROVED") {
      setMessage("This task already has an approved extension.");
      return;
    }

    const proposedDate = window.prompt(
      "Enter proposed completion date and time:\nExample: 2026-09-30T18:00"
    );

    if (!proposedDate?.trim()) {
      setMessage("Proposed completion date is required.");
      return;
    }

    const parsedDate = new Date(proposedDate);

    if (isNaN(parsedDate.getTime())) {
      setMessage("Invalid date format. Use: 2026-09-30T18:00");
      return;
    }

    const extensionReason = window.prompt(
      "Enter the reason for requesting extension:"
    );

    if (!extensionReason?.trim()) {
      setMessage("Extension reason is required.");
      return;
    }

    if (extensionReason.trim().length < 5) {
      setMessage("Extension reason must contain at least 5 characters.");
      return;
    }

    try {
      await API.post(`/worker/tasks/${task.report_id}/extension`, {
        proposed_completion_at: parsedDate.toISOString(),
        extension_reason: extensionReason.trim(),
      });

      setMessage("Extension request submitted successfully!");
      await fetchTasks();
    } catch (error) {
      setMessage(getErrorMessage(error, "Failed to request extension"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  const assignedTasks = tasks.filter(
    (task) =>
      task.status === "ASSIGNED" &&
      task.assignment_status !== "ACCEPTED"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  );

  const acceptedTasks = tasks.filter(
    (task) => task.assignment_status === "ACCEPTED"
  );

  const pendingTasks = tasks.filter(
    (task) => task.assignment_status === "WAITING"
  );

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #edf8f0, #f8fffa)",
      paddingBottom: "45px",
      fontFamily: "Arial, sans-serif",
      color: "#172b4d",
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

    banner: {
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
      padding: "25px 18px",
      textAlign: "center",
      cursor: "pointer",
      boxShadow: "0 7px 18px rgba(25,135,84,0.08)",
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

    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "1050px",
      marginTop: "20px",
    },

    cell: {
      padding: "14px",
      borderBottom: "1px solid #e5e7eb",
      textAlign: "left",
      verticalAlign: "top",
    },

    actionButton: {
      padding: "9px 14px",
      margin: "4px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
    },

    select: {
      padding: "9px",
      borderRadius: "8px",
      border: "1px solid #cedfd3",
      backgroundColor: "white",
      cursor: "pointer",
    },
  };

  const getStatusStyle = (status) => {
    if (status === "COMPLETED") {
      return { backgroundColor: "#d1e7dd", color: "#0f5132" };
    }

    if (status === "IN_PROGRESS") {
      return { backgroundColor: "#cfe2ff", color: "#084298" };
    }

    if (status === "REJECTED") {
      return { backgroundColor: "#f8d7da", color: "#842029" };
    }

    return { backgroundColor: "#fff3cd", color: "#664d03" };
  };

  const renderStatus = (status) => (
    <span
      style={{
        ...getStatusStyle(status),
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      }}
    >
      {status || "PENDING"}
    </span>
  );

  const renderExtensionInfo = (task) => {
    if (task.extension_status === "PENDING") {
      return (
        <div style={{ color: "#d97706", fontWeight: "bold" }}>
          ⏳ Extension Pending

          {task.proposed_completion_at && (
            <div style={{ fontWeight: "normal", marginTop: "6px" }}>
              Proposed:{" "}
              {new Date(task.proposed_completion_at).toLocaleString()}
            </div>
          )}

          {task.extension_reason && (
            <div style={{ fontWeight: "normal", marginTop: "6px" }}>
              Reason: {task.extension_reason}
            </div>
          )}
        </div>
      );
    }

    if (task.extension_status === "APPROVED") {
      return (
        <div style={{ color: "#198754", fontWeight: "bold" }}>
          ✅ Extension Approved

          {task.proposed_completion_at && (
            <div style={{ fontWeight: "normal", marginTop: "6px" }}>
              Proposed:{" "}
              {new Date(task.proposed_completion_at).toLocaleString()}
            </div>
          )}

          {task.expected_completion_at && (
            <div style={{ fontWeight: "normal", marginTop: "6px" }}>
              Expected:{" "}
              {new Date(task.expected_completion_at).toLocaleString()}
            </div>
          )}

          {task.extension_reason && (
            <div style={{ fontWeight: "normal", marginTop: "6px" }}>
              Reason: {task.extension_reason}
            </div>
          )}
        </div>
      );
    }

    if (task.extension_status === "REJECTED") {
      return (
        <div style={{ color: "#dc3545", fontWeight: "bold" }}>
          ❌ Extension Rejected
        </div>
      );
    }

    return <span style={{ color: "#6c757d" }}>No extension request</span>;
  };

  const renderTaskActions = (task) => {
    if (task.status === "COMPLETED") {
      return (
        <span style={{ color: "#198754", fontWeight: "bold" }}>
          ✅ Completed
        </span>
      );
    }

    if (task.assignment_status === "WAITING") {
      return (
        <div>
          <button
            style={{
              ...styles.actionButton,
              backgroundColor: "#198754",
              color: "white",
            }}
            onClick={() => decideAssignment(task.report_id, "ACCEPT")}
          >
            Accept
          </button>

          <button
            style={{
              ...styles.actionButton,
              backgroundColor: "#dc3545",
              color: "white",
            }}
            onClick={() => decideAssignment(task.report_id, "REJECT")}
          >
            Reject
          </button>
        </div>
      );
    }

    if (task.assignment_status === "REJECTED") {
      return (
        <span style={{ color: "#dc3545", fontWeight: "bold" }}>
          ❌ Assignment Rejected
        </span>
      );
    }

    if (task.assignment_status === "ACCEPTED") {
      return (
        <div>
          <select
            value={task.status}
            onChange={(e) =>
              updateTaskStatus(task.report_id, e.target.value)
            }
            style={styles.select}
          >
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          {task.extension_status !== "PENDING" &&
          task.extension_status !== "APPROVED" ? (
            <button
              style={{
                ...styles.actionButton,
                backgroundColor: "#f59e0b",
                color: "white",
              }}
              onClick={() => requestExtension(task)}
            >
              🕒 Request Extension
            </button>
          ) : null}
        </div>
      );
    }

    return (
      <span style={{ color: "#6c757d" }}>
        Waiting for assignment decision
      </span>
    );
  };

  const renderTasks = (taskList) => {
    if (taskList.length === 0) {
      return (
        <p style={{ color: "#6c757d" }}>
          No tasks found.
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
              <th style={styles.cell}>Report ID</th>
              <th style={styles.cell}>Waste Type</th>
              <th style={styles.cell}>Location</th>
              <th style={styles.cell}>Description</th>
              <th style={styles.cell}>Status</th>
              <th style={styles.cell}>Assignment</th>
              <th style={styles.cell}>Extension</th>
              <th style={styles.cell}>Action</th>
            </tr>
          </thead>

          <tbody>
            {taskList.map((task) => (
              <tr key={task.report_id}>
                <td style={styles.cell}>#{task.report_id}</td>
                <td style={styles.cell}>{task.waste_type}</td>
                <td style={styles.cell}>{task.location}</td>
                <td style={styles.cell}>{task.description}</td>
                <td style={styles.cell}>
                  {renderStatus(task.status)}
                </td>
                <td style={styles.cell}>
                  {task.assignment_status}
                </td>
                <td style={styles.cell}>
                  {renderExtensionInfo(task)}
                </td>
                <td style={styles.cell}>
                  {renderTaskActions(task)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderFeedback = () => {
    if (feedbackLoading) {
      return <p>Loading feedback...</p>;
    }

    if (feedback.length === 0) {
      return <p style={{ color: "#6c757d" }}>No feedback received yet.</p>;
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
              <th style={styles.cell}>Rating</th>
              <th style={styles.cell}>Message</th>
              <th style={styles.cell}>Date</th>
            </tr>
          </thead>

          <tbody>
            {feedback.map((item) => (
              <tr key={item.feedback_id}>
                <td style={styles.cell}>#{item.feedback_id}</td>
                <td style={styles.cell}>{item.report_id ?? "General"}</td>
                <td style={styles.cell}>
                  {"⭐".repeat(item.rating || 0)}
                </td>
                <td style={styles.cell}>{item.message}</td>
                <td style={styles.cell}>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
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
        <div style={{ fontSize: "22px", fontWeight: "bold" }}>
          🌿 Smart Waste Management
        </div>

        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>
      </nav>

      <div style={styles.container}>
        {/* WELCOME BANNER */}
        <div style={styles.banner}>
          <h1 style={{ margin: "0 0 12px", fontSize: "32px" }}>
            Welcome, {user?.full_name || "Worker"}! 👋
          </h1>

          <p style={{ margin: 0, fontSize: "17px" }}>
            Manage your collection tasks and keep your area clean. 🌍
          </p>
        </div>

        {/* HEADING */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <h2 style={{ color: "#146c43" }}>
            Waste Collection Services
          </h2>

          <p style={{ color: "#6c757d" }}>
            Manage assigned tasks and update collection progress
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={styles.card}
            onClick={() => setActiveSection("tasks")}
          >
            <div style={{ fontSize: "38px" }}>📋</div>
            <h3>My Tasks</h3>
            <p style={{ color: "#6c757d" }}>View all assigned tasks</p>
            <h2 style={{ color: "#198754" }}>{tasks.length}</h2>
          </div>

          <div
            style={styles.card}
            onClick={() => setActiveSection("progress")}
          >
            <div style={{ fontSize: "38px" }}>📊</div>
            <h3>In Progress</h3>
            <p style={{ color: "#6c757d" }}>Track collection progress</p>
            <h2 style={{ color: "#0d6efd" }}>{acceptedTasks.length}</h2>
          </div>

          <div
            style={styles.card}
            onClick={() => setActiveSection("completed")}
          >
            <div style={{ fontSize: "38px" }}>✅</div>
            <h3>Completed</h3>
            <p style={{ color: "#6c757d" }}>View completed work</p>
            <h2 style={{ color: "#198754" }}>{completedTasks.length}</h2>
          </div>

          <div
            style={styles.card}
            onClick={() => setActiveSection("assigned")}
          >
            <div style={{ fontSize: "38px" }}>🗑️</div>
            <h3>New Assignments</h3>
            <p style={{ color: "#6c757d" }}>View pending assignments</p>
            <h2 style={{ color: "#d39e00" }}>{pendingTasks.length}</h2>
          </div>

          <div
            style={styles.card}
            onClick={() => setActiveSection("feedback")}
          >
            <div style={{ fontSize: "38px" }}>💬</div>
            <h3>Feedback</h3>
            <p style={{ color: "#6c757d" }}>View citizen feedback</p>
            <h2 style={{ color: "#dc3545" }}>{feedback.length}</h2>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            style={{
              marginTop: "25px",
              padding: "14px 18px",
              borderRadius: "10px",
              backgroundColor: message.toLowerCase().includes("success")
                ? "#d1e7dd"
                : "#f8d7da",
              color: message.toLowerCase().includes("success")
                ? "#0f5132"
                : "#842029",
              fontWeight: "bold",
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
            style={styles.sectionButton(activeSection === "tasks")}
            onClick={() => setActiveSection("tasks")}
          >
            📋 My Tasks
          </button>

          <button
            style={styles.sectionButton(activeSection === "progress")}
            onClick={() => setActiveSection("progress")}
          >
            📊 Track Status
          </button>

          <button
            style={styles.sectionButton(activeSection === "completed")}
            onClick={() => setActiveSection("completed")}
          >
            ✅ Completed
          </button>

          <button
            style={styles.sectionButton(activeSection === "assigned")}
            onClick={() => setActiveSection("assigned")}
          >
            🗑️ Assigned Tasks
          </button>

          <button
            style={styles.sectionButton(activeSection === "feedback")}
            onClick={() => setActiveSection("feedback")}
          >
            💬 Feedback
          </button>
        </div>

        {/* CONTENT */}
        <div style={styles.contentBox}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "30px" }}>
              <h3>⏳ Loading tasks...</h3>
              <p style={{ color: "#6c757d" }}>
                Please wait while your tasks are loaded.
              </p>
            </div>
          ) : activeSection === "tasks" ? (
            <>
              <h2 style={{ color: "#146c43" }}>📋 My Tasks</h2>
              <p style={{ color: "#6c757d" }}>
                View and manage all your assigned tasks.
              </p>
              {renderTasks(tasks)}
            </>
          ) : activeSection === "progress" ? (
            <>
              <h2 style={{ color: "#146c43" }}>📊 Track Status</h2>
              <p style={{ color: "#6c757d" }}>
                Track your ongoing collection work.
              </p>
              {renderTasks(
                tasks.filter((task) => task.status !== "COMPLETED")
              )}
            </>
          ) : activeSection === "completed" ? (
            <>
              <h2 style={{ color: "#146c43" }}>✅ Completed Tasks</h2>
              <p style={{ color: "#6c757d" }}>
                View your completed collection work.
              </p>
              {renderTasks(completedTasks)}
            </>
          ) : activeSection === "assigned" ? (
            <>
              <h2 style={{ color: "#146c43" }}>🗑️ Assigned Tasks</h2>
              <p style={{ color: "#6c757d" }}>
                Review new assignments and accept or reject them.
              </p>
              {renderTasks(assignedTasks)}
            </>
          ) : activeSection === "feedback" ? (
            <>
              <h2 style={{ color: "#146c43" }}>💬 Citizen Feedback</h2>
              <p style={{ color: "#6c757d" }}>
                View feedback received for your assigned tasks.
              </p>
              {renderFeedback()}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <h3 style={{ color: "#146c43" }}>
                Select a service to continue 🌿
              </h3>
              <p style={{ color: "#6c757d" }}>
                Choose one of the options above to view your tasks.
              </p>
            </div>
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