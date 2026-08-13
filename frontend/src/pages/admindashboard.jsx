import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [reports, setReports] = useState([]);

  const workers = [
    "Worker 1",
    "Worker 2",
    "Worker 3",
    "Worker 4",
    "Worker 5",
  ];

  // Load complaints
  useEffect(() => {
    const complaints =
      JSON.parse(localStorage.getItem("wasteComplaints")) || [];

    setReports(complaints);
  }, []);

  // Assign worker
  const handleAssignWorker = (complaintId, workerName) => {
    const complaints =
      JSON.parse(localStorage.getItem("wasteComplaints")) || [];

    const updatedComplaints = complaints.map((complaint) => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          assignedWorker: workerName,
          status: workerName ? "Assigned" : "Submitted",
        };
      }

      return complaint;
    });

    localStorage.setItem(
      "wasteComplaints",
      JSON.stringify(updatedComplaints)
    );

    setReports(updatedComplaints);
  };

  // Logout
  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-vh-100 bg-light">

      {/* Navbar */}
      <nav className="navbar navbar-dark bg-success px-4">
        <span className="navbar-brand fw-bold">
          Smart Waste Management - Admin
        </span>

        <button
          className="btn btn-light"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="container py-5">

        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold">
            Admin Dashboard
          </h2>

          <p className="text-muted">
            Manage waste complaints and assign workers.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="row g-4 mb-5">

          {/* Total Reports */}
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h6 className="text-muted">
                  Total Reports
                </h6>

                <h2 className="fw-bold text-success">
                  {reports.length}
                </h2>
              </div>
            </div>
          </div>

          {/* Pending Reports */}
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h6 className="text-muted">
                  Pending Reports
                </h6>

                <h2 className="fw-bold text-warning">
                  {
                    reports.filter(
                      (report) =>
                        !report.assignedWorker
                    ).length
                  }
                </h2>
              </div>
            </div>
          </div>

          {/* Assigned Reports */}
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h6 className="text-muted">
                  Assigned Reports
                </h6>

                <h2 className="fw-bold text-primary">
                  {
                    reports.filter(
                      (report) =>
                        report.assignedWorker
                    ).length
                  }
                </h2>
              </div>
            </div>
          </div>

        </div>

        {/* Reports Section */}
        <div className="mb-4">
          <h3 className="fw-bold">
            Reports
          </h3>

          <p className="text-muted">
            View complaints submitted by citizens and assign workers.
          </p>
        </div>

        {/* No Reports */}
        {reports.length === 0 ? (
          <div className="card shadow-sm">
            <div className="card-body text-center p-5">

              <h4 className="text-muted">
                No complaints available
              </h4>

              <p className="text-muted mb-0">
                Complaints submitted by users will appear here.
              </p>

            </div>
          </div>
        ) : (

          /* Reports */
          <div className="row g-4">

            {reports.map((report, index) => (

              <div
                className="col-12"
                key={report.id || index}
              >

                <div className="card shadow-sm">

                  <div className="card-body">

                    {/* Report Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">

                      <div>
                        <h4 className="fw-bold text-success mb-1">
                          Complaint #{index + 1}
                        </h4>

                        <small className="text-muted">
                          Complaint ID: {report.id}
                        </small>
                      </div>

                      <span
                        className={`badge fs-6 ${
                          report.status === "Assigned"
                            ? "bg-primary"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {report.status || "Submitted"}
                      </span>

                    </div>

                    {/* Complaint Information */}
                    <div className="row">

                      {/* Complaint Type */}
                      <div className="col-md-6 mb-3">
                        <strong>
                          Complaint Type:
                        </strong>

                        <p className="mb-0">
                          {report.complaintType || "Not provided"}
                        </p>
                      </div>

                      {/* Date */}
                      <div className="col-md-6 mb-3">
                        <strong>
                          Date:
                        </strong>

                        <p className="mb-0">
                          {report.date || "Not available"}
                        </p>
                      </div>

                      {/* Municipality ID */}
                      <div className="col-md-6 mb-3">
                        <strong>
                          Municipality ID:
                        </strong>

                        <p className="mb-0">
                          {report.municipalityId || "Not provided"}
                        </p>
                      </div>

                      {/* Municipality Name */}
                      <div className="col-md-6 mb-3">
                        <strong>
                          Municipality Name:
                        </strong>

                        <p className="mb-0">
                          {report.municipalityName || "Not provided"}
                        </p>
                      </div>

                      {/* Location */}
                      <div className="col-md-6 mb-3">
                        <strong>
                          Location:
                        </strong>

                        <p className="mb-0">
                          {report.location || "Not provided"}
                        </p>
                      </div>

                      {/* Landmark */}
                      <div className="col-md-6 mb-3">
                        <strong>
                          Landmark:
                        </strong>

                        <p className="mb-0">
                          {report.landmark || "Not provided"}
                        </p>
                      </div>

                      {/* Description */}
                      <div className="col-12 mb-3">
                        <strong>
                          Complaint Description:
                        </strong>

                        <div className="border rounded p-3 mt-2 bg-light">
                          {report.description || "No description provided"}
                        </div>
                      </div>

                    </div>

                    <hr />

                    {/* Citizen Information */}
                    <h5 className="fw-bold text-success mb-3">
                      Citizen Information
                    </h5>

                    <div className="row">

                      <div className="col-md-4 mb-3">
                        <strong>
                          Name:
                        </strong>

                        <p className="mb-0">
                          {report.name || "Not provided"}
                        </p>
                      </div>

                      <div className="col-md-4 mb-3">
                        <strong>
                          Phone:
                        </strong>

                        <p className="mb-0">
                          {report.phone || "Not provided"}
                        </p>
                      </div>

                      <div className="col-md-4 mb-3">
                        <strong>
                          Email:
                        </strong>

                        <p className="mb-0">
                          {report.email || "Not provided"}
                        </p>
                      </div>

                    </div>

                    <hr />

                    {/* Assign Worker */}
                    <div className="p-3 border rounded bg-light">

                      <h5 className="fw-bold text-success mb-3">
                        Assign Worker
                      </h5>

                      <div className="row align-items-center">

                        <div className="col-md-8">

                          <select
                            className="form-select"
                            value={
                              report.assignedWorker || ""
                            }
                            onChange={(e) =>
                              handleAssignWorker(
                                report.id,
                                e.target.value
                              )
                            }
                          >

                            <option value="">
                              Select Worker
                            </option>

                            {workers.map((worker) => (
                              <option
                                key={worker}
                                value={worker}
                              >
                                {worker}
                              </option>
                            ))}

                          </select>

                        </div>

                        <div className="col-md-4 mt-3 mt-md-0">

                          {report.assignedWorker ? (

                            <div>
                              <span className="badge bg-success fs-6 p-2">
                                Assigned
                              </span>

                              <p className="mb-0 mt-2">
                                <strong>
                                  Worker:
                                </strong>{" "}
                                {report.assignedWorker}
                              </p>
                            </div>

                          ) : (

                            <span className="badge bg-secondary fs-6 p-2">
                              Not Assigned
                            </span>

                          )}

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminDashboard;