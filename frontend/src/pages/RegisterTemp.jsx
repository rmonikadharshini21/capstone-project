
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterTemp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    municipality_area_name: "",
    municipality_number: "",
    role: "CITIZEN",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(data.detail)
          ? data.detail.map((item) => item.msg).join(", ")
          : data.detail || "Registration failed";

        throw new Error(errorMessage);
      }

      setMessage("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #edf8f0, #f8fffa)",
      padding: "35px 15px",
      fontFamily: "Arial, sans-serif",
    },

    card: {
      width: "100%",
      maxWidth: "600px",
      margin: "auto",
      backgroundColor: "white",
      borderRadius: "24px",
      padding: "35px",
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

    field: {
      marginBottom: "18px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "46px", marginBottom: "10px" }}>
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
            Create your account and help keep your environment clean
          </p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            style={{
              padding: "13px",
              borderRadius: "10px",
              marginBottom: "22px",
              backgroundColor: message.includes("successful")
                ? "#d1e7dd"
                : "#f8d7da",
              color: message.includes("successful")
                ? "#0f5132"
                : "#842029",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* FULL NAME */}
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>

            <input
              type="text"
              name="full_name"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* EMAIL */}
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>

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
          <div style={styles.field}>
            <label style={styles.label}>Password</label>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  paddingRight: "75px",
                }}
                minLength="6"
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

          {/* PHONE */}
          <div style={styles.field}>
            <label style={styles.label}>Phone Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* ADDRESS */}
          <div style={styles.field}>
            <label style={styles.label}>Address</label>

            <textarea
              name="address"
              placeholder="Enter your complete address"
              value={formData.address}
              onChange={handleChange}
              style={{
                ...styles.input,
                minHeight: "80px",
                resize: "vertical",
              }}
              required
            />
          </div>

          {/* MUNICIPALITY AREA */}
          <div style={styles.field}>
            <label style={styles.label}>
              Municipality Area Name
            </label>

            <input
              type="text"
              name="municipality_area_name"
              placeholder="Enter municipality area"
              value={formData.municipality_area_name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* MUNICIPALITY NUMBER */}
          <div style={styles.field}>
            <label style={styles.label}>
              Municipality Number
            </label>

            <input
              type="text"
              name="municipality_number"
              placeholder="Enter municipality number"
              value={formData.municipality_number}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* ROLE */}
          <div style={styles.field}>
            <label style={styles.label}>Account Type</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="CITIZEN">Citizen</option>
              <option value="WORKER">Worker</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >
          <span style={{ color: "#6c757d", fontSize: "14px" }}>
            Already have an account?{" "}
          </span>

          <Link
            to="/login"
            style={{
              color: "#198754",
              fontWeight: "bold",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Login
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