import React, { useState } from "react";

function ReportWaste() {

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

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    // Get logged-in user email
    const loggedInEmail =
      localStorage.getItem("loggedInUserEmail");

    if (!loggedInEmail) {
      setMessage("Please login before submitting a complaint.");
      return;
    }

    // Make sure complaint email belongs to logged-in user
    const complaintEmail =
      loggedInEmail.trim().toLowerCase();

    const complaint = {

      id: "CMP" + Date.now(),

      complaintType: formData.complaintType,

      municipalityId: formData.municipalityId,

      municipalityName: formData.municipalityName,

      location: formData.location,

      landmark: formData.landmark,

      description: formData.description,

      name: formData.name,

      phone: formData.phone,

      email: complaintEmail,

      // IMPORTANT
      userEmail: complaintEmail,

      status: "Submitted",

      date: new Date().toLocaleString(),
    };

    // Get existing complaints
    const existingComplaints =
      JSON.parse(
        localStorage.getItem("wasteComplaints")
      ) || [];

    // Add new complaint
    existingComplaints.push(complaint);

    // Save all complaints
    localStorage.setItem(
      "wasteComplaints",
      JSON.stringify(existingComplaints)
    );

    setMessage(
      `Complaint submitted successfully! Complaint ID: ${complaint.id}`
    );

    // Clear form
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
  };

  return (
    <div className="min-vh-100 bg-light">

      {/* Navbar */}

      <nav className="navbar navbar-dark bg-success px-4">

        <span className="navbar-brand fw-bold">
          Smart Waste Management
        </span>

        <button
          className="btn btn-light"
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        >
          Back to Dashboard
        </button>

      </nav>

      {/* Main */}

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

            <form onSubmit={handleSubmit}>

              {/* Complaint Type */}

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

              {/* Municipality */}

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

              {/* Location */}

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
                  placeholder="Enter the exact waste location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* Landmark */}

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Nearby Landmark
                </label>

                <input
                  type="text"
                  name="landmark"
                  className="form-control"
                  placeholder="Example: Near bus stand, school, temple"
                  value={formData.landmark}
                  onChange={handleChange}
                />

              </div>

              {/* Description */}

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

              {/* Contact */}

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