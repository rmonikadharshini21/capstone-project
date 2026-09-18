import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:8000/admin/reports',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to fetch reports');
        }

        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchReports();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div className="container py-4">

      <header className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="fw-bold text-primary mb-0">
            Admin Dashboard
          </h2>

          {user && (
            <small className="text-muted">
              Logged in as: <strong>{user.full_name}</strong> ({user.role})
            </small>
          )}
        </div>

        <button
          className="btn btn-outline-danger px-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <div className="card shadow-sm border-0 p-4">

        <h4 className="fw-bold text-secondary mb-3">
          Waste Complaint Management
        </h4>

        {loading && <p>Loading reports...</p>}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="table-responsive mt-3">
            <table className="table table-hover border align-middle">

              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Waste Type</th>
                  <th>Location</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No waste reports found.
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.report_id}>
                      <td>#{report.report_id}</td>

                      <td>{report.waste_type}</td>

                      <td>{report.location}</td>

                      <td>{report.description}</td>

                      <td>
                        <span className="badge bg-warning text-dark">
                          {report.priority_level || 'MEDIUM'}
                        </span>
                      </td>

                      <td>
                        <span className="badge bg-info text-dark">
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
}