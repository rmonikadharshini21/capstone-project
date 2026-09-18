import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function Dashboard() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || 'CITIZEN';

  const [reports, setReports] = useState([]);
  const [wasteType, setWasteType] = useState('Plastic');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const fetchReports = async () => {
    try {
      const response = await API.get('/waste/reports');
      setReports(response.data);
    } catch (err) {
      console.error('Failed to fetch reports', err);
      setMessage('Failed to load reports');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCreateReport = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await API.post('/waste/report', {
        waste_type: wasteType,
        location,
        description
      });

      setMessage('Report submitted successfully!');

      setLocation('');
      setDescription('');

      fetchReports();
    } catch (err) {
      setMessage(
        err.response?.data?.detail || 'Failed to submit report'
      );
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      <h2>Dashboard ({role})</h2>

      {role === 'CITIZEN' && (
        <div
          style={{
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}
        >
          <h3>Submit a New Waste Report</h3>

          {message && (
            <p style={{ color: 'green' }}>
              {message}
            </p>
          )}

          <form onSubmit={handleCreateReport}>
            <div style={{ marginBottom: '10px' }}>
              <label>Waste Type:</label>

              <select
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              >
                <option value="Plastic">Plastic</option>
                <option value="Organic">Organic</option>
                <option value="Hazardous">Hazardous</option>
                <option value="E-Waste">E-Waste</option>
              </select>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Location:</label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Description:</label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '10px 15px',
                backgroundColor: '#38a169',
                color: '#fff',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Submit Report
            </button>
          </form>
        </div>
      )}

      <h3>Submitted Reports</h3>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '10px'
        }}
      >
        <thead>
          <tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
            <th>ID</th>
            <th>Type</th>
            <th>Location</th>
            <th>AI Tag</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((r) => (
            <tr key={r.report_id}>
              <td>{r.report_id}</td>
              <td>{r.waste_type}</td>
              <td>{r.location}</td>
              <td>{r.ai_category || 'N/A'}</td>
              <td>{r.priority_level || 'MEDIUM'}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}