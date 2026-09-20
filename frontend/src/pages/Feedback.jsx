
import React, { useState } from "react";

function Feedback() {
  const [reportId, setReportId] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/waste/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            report_id: reportId ? Number(reportId) : null,
            rating: Number(rating),
            message: message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to submit feedback");
      }

      setSuccess("Feedback submitted successfully!");
      setReportId("");
      setRating(5);
      setMessage("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-success px-4">
        <span className="navbar-brand fw-bold">
          Smart Waste Management
        </span>
      </nav>

      <div className="container py-5">
        <div className="card shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
          <div className="card-body p-4">
            <h2 className="text-center text-success fw-bold mb-4">
              Give Feedback
            </h2>

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Report ID (Optional)
                </label>

                <input
                  type="number"
                  className="form-control"
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  placeholder="Enter report ID"
                  min="1"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  Rating
                </label>

                <select
                  className="form-select"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  required
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Very Poor</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  Message
                </label>

                <textarea
                  className="form-control"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your feedback"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;