
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("Logging in...");

    try {
      const data = await loginUser(email, password);

      console.log("Login response:", data);

      localStorage.setItem(
        "loggedInUserEmail",
        email.trim().toLowerCase()
      );

      localStorage.setItem("loggedInUser", JSON.stringify(data));

      // Support both response formats
      const user = data.user || data;
      const role = (user.role || "CITIZEN").toUpperCase();

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      localStorage.setItem("user", JSON.stringify(user));

      if (role === "ADMIN") {
        window.location.href = "/admin";
      } else if (role === "WORKER") {
        window.location.href = "/worker";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #edf8f0, #f8fffa)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "25px 15px",
      fontFamily: "Arial, sans-serif",
    },

    card: {
      width: "100%",
      maxWidth: "430px",
      backgroundColor: "white",
      borderRadius: "24px",
      padding: "38px",
      boxShadow: "0 12px 35px rgba(25, 135, 84, 0.13)",
      border: "1px solid #e1eee5",
      boxSizing: "border-box",
    },

    input: {
      width: "100%",
      boxSizing: "border-box",
      padding: "13px 14px",
      border: "1px solid #cfe3d5",
      borderRadius: "10px",
      fontSize: "14px",
      outline: "none",
    },

    label: {
      display: "block",
      fontWeight: "bold",
      fontSize: "14px",
      color: "#344054",
      marginBottom: "8px",
    },

    button: {
      width: "100%",
      padding: "14px",
      border: "none",
      borderRadius: "12px",
      background: "linear-gradient(90deg, #146c43, #198754)",
      color: "white",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
    },
  };

  const isSuccess = message.includes("successful");
  const isLoading = message.includes("Logging");

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>
            🌿
          </div>

          <h2
            style={{
              color: "#146c43",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Smart Waste Management
          </h2>

          <p style={{ color: "#6c757d", margin: 0 }}>
            Welcome back! Login to your account
          </p>
        </div>

        {message && (
          <div
            style={{
              padding: "13px",
              borderRadius: "10px",
              marginBottom: "22px",
              backgroundColor: isSuccess
                ? "#d1e7dd"
                : isLoading
                ? "#cfe2ff"
                : "#f8d7da",
              color: isSuccess
                ? "#0f5132"
                : isLoading
                ? "#084298"
                : "#842029",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={styles.label}>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={styles.label}>Password</label>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  ...styles.input,
                  paddingRight: "75px",
                }}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  color: "#198754",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "26px",
          }}
        >
          <span style={{ color: "#6c757d", fontSize: "14px" }}>
            Don't have an account?{" "}
          </span>

          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{
              background: "none",
              border: "none",
              color: "#198754",
              fontWeight: "bold",
              cursor: "pointer",
              padding: 0,
              fontSize: "14px",
            }}
          >
            Register
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#98a2b3",
            fontSize: "12px",
            marginTop: "28px",
            marginBottom: 0,
          }}
        >
          © 2026 Smart Waste Management System 🌿
        </p>
      </div>
    </div>
  );
}

export default Login;