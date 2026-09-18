import React, { useState } from "react";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [areaName, setAreaName] = useState("");
  const [municipalityNumber, setMunicipalityNumber] = useState("");
  const [role, setRole] = useState("PUBLIC");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("Registering...");

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
            email: email,
            password: password,
            phone: phone,
            address: address,
            municipality_area_name: areaName,
            municipality_number: municipalityNumber,
            role: role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Registration failed"
        );
      }

      setMessage(
        `${role} registration successful!`
      );

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
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
      <div
        className="card shadow p-4"
        style={{
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">
            Smart Waste Management
          </h2>

          <p className="text-muted">
            Create your account
          </p>
        </div>

        {message && (
          <div className="alert alert-info">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Full Name
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Email Address
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Password
            </label>

            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Phone Number
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Address
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter your address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Municipality Area Name
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter municipality area"
              value={areaName}
              onChange={(e) =>
                setAreaName(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Municipality Number
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter municipality number"
              value={municipalityNumber}
              onChange={(e) =>
                setMunicipalityNumber(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Account Type
            </label>

            <select
              className="form-select"
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              required
            >
              <option value="PUBLIC">
                Public
              </option>

              <option value="WORKER">
                Worker
              </option>

              <option value="ADMIN">
                Admin
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 fw-semibold"
          >
            Register
          </button>

        </form>

        <div className="text-center mt-4">
          <a
            href="/"
            className="text-success text-decoration-none fw-semibold"
          >
            Already have an account? Login
          </a>
        </div>

      </div>
    </div>
  );
}

export default Register;