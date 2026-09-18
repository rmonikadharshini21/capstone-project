
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ReportWaste() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    complaintType: "",
    municipalityId: "",
    municipalityName: "",
    location: "",
    landmark: "",
    description: "",
    name: "",
    phone: "",
    email: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before submitting a complaint.");
      navigate("/login");
      return;
    }

    const reportData = {
      waste_type: formData.complaintType,
      location: `${formData.location}${
        formData.landmark
          ? `, Landmark: ${formData.landmark}`
          : ""
      }`,
      description: `${
        formData.description
      }\nMunicipality ID: ${
        formData.municipalityId
      }\nMunicipality Name: ${
        formData.municipalityName
      }\nName: ${
        formData.name
      }\nPhone: ${
        formData.phone
      }\nEmail: ${
        formData.email
      }`,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/waste/report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reportData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Complaint submission failed"
        );
      }

      setMessage(
        `Complaint submitted successfully! Report ID: ${
          data.report_id || "Created"
        }`
      );

      setFormData({
        complaintType: "",
        municipalityId: "",
        municipalityName: "",
        location: "",
        landmark: "",
        description: "",
        name: "",
        phone: "",
        email: "",
      });
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-success px-4">
        <span className="navbar-brand fw-bold">
          Smart Waste Management
        </span>

        <button
          className="btn btn-light"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </nav>

      <div className="container py-5">
        <div
          className="card shadow mx-auto"
          style={{ maxWidth: "800px" }}
        >
          <div className="card-body p-4">
            <h2 className="fw-bold text-success text-center mb-2">
              Report Waste / Complaint
            </h2>

            <p className="text-muted text-center mb-4">
              Submit a complaint about waste or garbage problems.
            </p>

            {message && (
              <div className="alert alert-success">
                {message}
              </div>
            )}

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Complaint Type
                </label>

                <select
                  name="complaintType"
                  className="form-select"
                  value={formData.complaintType}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select complaint type
                  </option>
                  <option value="Plastic Waste">
                    Plastic Waste
                  </option>
                  <option value="General Garbage">
                    General Garbage
                  </option>
                  <option value="Dead Animal">
                    Dead Animal
                  </option>
                  <option value="Household Waste">
                    Household Waste
                  </option>
                  <option value="Construction Waste">
                    Construction Waste
                  </option>
                  <option value="E-Waste">
                    E-Waste
                  </option>
                  <option value="Overflowing Garbage Bin">
                    Overflowing Garbage Bin
                  </option>
                  <option value="Sewage / Wastewater">
                    Sewage / Wastewater
                  </option>
                  <option value="Illegal Dumping">
                    Illegal Dumping
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <h5 className="fw-bold text-success mb-3">
                Municipality Information
              </h5>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Municipality ID
                  </label>

                  <input
                    type="text"
                    name="municipalityId"
                    className="form-control"
                    value={formData.municipalityId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Municipality Name
                  </label>

                  <input
                    type="text"
                    name="municipalityName"
                    className="form-control"
                    value={formData.municipalityName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <h5 className="fw-bold text-success mt-3 mb-3">
                Waste Location
              </h5>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Full Location / Address
                </label>

                <textarea
                  name="location"
                  className="form-control"
                  rows="3"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Nearby Landmark
                </label>

                <input
                  type="text"
                  name="landmark"
                  className="form-control"
                  value={formData.landmark}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Complaint Description
                </label>

                <textarea
                  name="description"
                  className="form-control"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <h5 className="fw-bold text-success mb-3">
                Your Contact Information
              </h5>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Your Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 fw-semibold py-2"
              >
                Submit Complaint
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportWaste;