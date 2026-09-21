
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Convert backend errors into readable text
const getErrorMessage = (detail) => {
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") return item;
        return item.msg || JSON.stringify(item);
      })
      .join(", ");
  }

  if (detail && typeof detail === "object") {
    return (
      detail.message ||
      detail.msg ||
      JSON.stringify(detail)
    );
  }

  return "Login failed";
};

export default function LoginTemp({ setAuth }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_URL =
    "https://capstone-project-ds0d.onrender.com";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = getErrorMessage(
          data.detail || data.message || data.error
        );

        throw new Error(errorMessage);
      }

      if (!data.access_token) {
        throw new Error("Login successful, but token is missing");
      }

      // Save token
      localStorage.setItem(
        "token",
        data.access_token
      );

      // Save user details
      localStorage.setItem(
        "user",
        JSON.stringify(data.user || data)
      );

      localStorage.setItem(
        "loggedInUserEmail",
        formData.email.trim().toLowerCase()
      );

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(data)
      );

      // Update authentication
      if (setAuth) {
        setAuth(true);
      }

      // Get user role
      const user = data.user || data;

      const role = String(
        user.role || "CITIZEN"
      ).toUpperCase();

      // Navigate based on role
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "WORKER") {
        navigate("/worker");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        typeof err.message === "string"
          ? err.message
          : JSON.stringify(err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #edf8f0, #f8fffa)",
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
      boxShadow:
        "0 12px 35px rgba(25, 135, 84, 0.13)",
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
      background:
        "linear-gradient(90deg, #146c43, #198754)",
      color: "white",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "12px",
            }}
          >
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

          <p
            style={{
              color: "#6c757d",
              margin: 0,
            }}
          >
            Welcome back! Login to your account
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#842029",
              padding: "13px",
              borderRadius: "10px",
              marginBottom: "22px",
              fontSize: "14px",
              fontWeight: "bold",
              overflowWrap: "anywhere",
            }}
          >
            {String(error)}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div style={{ marginBottom: "20px" }}>
            <label style={styles.label}>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: "25px" }}>
            <label style={styles.label}>
              Password
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={
                  showPassword ? "text" : "password"
                }
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  paddingRight: "75px",
                }}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
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

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* REGISTER LINK */}
        <div
          style={{
            textAlign: "center",
            marginTop: "26px",
          }}
        >
          <span
            style={{
              color: "#6c757d",
              fontSize: "14px",
            }}
          >
            Don't have an account?{" "}
          </span>

          <Link
            to="/register"
            style={{
              color: "#198754",
              fontWeight: "bold",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Register
          </Link>
        </div>

        {/* FOOTER */}
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