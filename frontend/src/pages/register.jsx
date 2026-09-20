
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [areaName, setAreaName] = useState("");
  const [municipalityNumber, setMunicipalityNumber] = useState("");
  const [role, setRole] = useState("PUBLIC");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Registering your account...");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: fullName,
            email,
            password,
            phone,
            address,
            municipality_area_name: areaName,
            municipality_number: municipalityNumber,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setMessage("Registration successful! You can now login.");

      setFullName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setAddress("");
      setAreaName("");
      setMunicipalityNumber("");
      setRole("PUBLIC");
    } catch (error) {
      console.error("Register error:", error);
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
    },

    input: {
      borderRadius: "10px",
      padding: "12px 14px",
      border: "1px solid #cfe3d5",
      width: "100%",
      outline: "none",
      fontSize: "14px",
      boxSizing: "border-box",
    },

    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "8px",
      color: "#344054",
      fontSize: "14px",
    },

    button: {
      width: "100%",
      border: "none",
      borderRadius: "12px",
      padding: "14px",
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
          <div
            style={{
              fontSize: "45px",
              marginBottom: "10px",
            }}
          >
            🌿
          </div>

          <h2
            style={{
              color: "#146c43",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Smart Waste Management
          </h2>

          <p style={{ color: "#6c757d", margin: 0 }}>
            Create your account and keep your environment clean
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
                : message.includes("Registering")
                ? "#cfe2ff"
                : "#f8d7da",
              color: message.includes("successful")
                ? "#0f5132"
                : message.includes("Registering")
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
          {/* FULL NAME */}
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* EMAIL */}
          <div style={styles.field}>
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

          {/* PASSWORD */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              minLength="6"
              required
            />
          </div>

          {/* PHONE */}
          <div style={styles.field}>
            <label style={styles.label}>Phone Number</label>

            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* ADDRESS */}
          <div style={styles.field}>
            <label style={styles.label}>Address</label>

            <textarea
              placeholder="Enter your complete address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                ...styles.input,
                minHeight: "80px",
                resize: "vertical",
              }}
              required
            />
          </div>

          {/* AREA NAME */}
          <div style={styles.field}>
            <label style={styles.label}>
              Municipality Area Name
            </label>

            <input
              type="text"
              placeholder="Enter municipality area"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
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
              placeholder="Enter municipality number"
              value={municipalityNumber}
              onChange={(e) =>
                setMunicipalityNumber(e.target.value)
              }
              style={styles.input}
              required
            />
          </div>

          {/* ROLE */}
          <div style={styles.field}>
            <label style={styles.label}>Account Type</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.input}
              required
            >
              <option value="PUBLIC">Public</option>
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

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              color: "#198754",
              fontWeight: "bold",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Login
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#98a2b3",
            fontSize: "12px",
            marginTop: "25px",
            marginBottom: 0,
          }}
        >
          © 2026 Smart Waste Management System 🌿
        </p>
      </div>
    </div>
  );
}

export default Register;