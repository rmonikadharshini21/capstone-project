
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://capstone-project-ds0d.onrender.com";

function ReportWaste() {
  const navigate = useNavigate();

  const initialFormData = {
    complaintType: "",
    municipalityId: "",
    municipalityName: "",
    location: "",
    landmark: "",
    description: "",
    name: "",
    phone: "",
    email: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before submitting a complaint.");
      navigate("/login");
      return;
    }

    if (!formData.complaintType) {
      setError("Please select a complaint type.");
      return;
    }

    setLoading(true);

    const reportData = {
      waste_type: formData.complaintType,

      location: `${formData.location}${
        formData.landmark.trim()
          ? `, Landmark: ${formData.landmark.trim()}`
          : ""
      }`,

      description: `${formData.description.trim()}

Municipality ID: ${formData.municipalityId.trim()}
Municipality Name: ${formData.municipalityName.trim()}
Name: ${formData.name.trim()}
Phone: ${formData.phone.trim()}
Email: ${formData.email.trim()}`,
    };

    try {
      const response = await fetch(
        `${API_URL}/waste/report`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(reportData),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        const errorMessage = Array.isArray(data.detail)
          ? data.detail
              .map((item) => item.msg)
              .join(", ")
          : data.detail || "Complaint submission failed";

        throw new Error(errorMessage);
      }

      setMessage(
        `Complaint submitted successfully! Report ID: ${
          data.report_id || data.id || "Created"
        }`
      );

      setFormData(initialFormData);

    } catch (err) {
      console.error("Submission error:", err);

      setError(
        err.message || "Failed to submit complaint"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">

      {/* NAVBAR */}
      <nav className="navbar navbar-dark bg-success px-4">
        <span className="navbar-brand fw-bold">
          Smart Waste Management
        </span>

        <button
          type="button"
          className="btn btn-light"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <div className="container py-5">
        <div
          className="card shadow mx-auto"
          style={{ maxWidth: "800px" }}
        >
          <div className="card-body p-4">

            {/* TITLE */}
            <h2 className="fw-bold text-success text-center mb-2">
              Report Waste / Complaint
            </h2>

            <p className="text-muted text-center mb-4">
              Submit a complaint about waste or garbage problems.
            </p>

            {/* SUCCESS MESSAGE */}
            {message && (
              <div
                className="alert alert-success"
                role="alert"
              >
                {message}
              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div
                className="alert alert-danger"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit}>

              {/* COMPLAINT TYPE */}
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

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* MUNICIPALITY INFORMATION */}
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
                    placeholder="Enter municipality ID"
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
                    placeholder="Enter municipality name"
                    value={formData.municipalityName}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              {/* WASTE LOCATION */}
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
                  placeholder="Enter waste location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* LANDMARK */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Nearby Landmark
                </label>

                <input
                  type="text"
                  name="landmark"
                  className="form-control"
                  placeholder="Enter nearby landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Complaint Description
                </label>

                <textarea
                  name="description"
                  className="form-control"
                  rows="5"
                  placeholder="Describe the waste problem"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* CONTACT INFORMATION */}
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
                    placeholder="Enter your name"
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
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              {/* EMAIL */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="btn btn-success w-100 fw-semibold py-2"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Complaint"}
              </button>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportWaste;