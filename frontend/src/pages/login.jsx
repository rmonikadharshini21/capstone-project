import React, { useState } from "react";
import { loginUser } from "../services/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("Logging in...");

    try {
      const data = await loginUser(email, password);

      console.log("Login response:", data);

      setMessage("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card shadow p-4"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">
            Smart Waste Management
          </h2>

          <p className="text-muted">
            Login to your account
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
              Email Address
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 fw-semibold"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="mb-0">
            Don't have an account?{" "}
            <span className="text-success fw-semibold">
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;