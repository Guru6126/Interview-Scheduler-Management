import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Interviews = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('ALL');

  const interviewsData = [
    { id: 1, candidate: 'Aadhya Nair', job: 'Technical Engineer', interviewers: 'John Doe, Jane Smith', date: '2026-08-19, 10:00 AM', status: 'Confirmed', round: 'Technical' },
    { id: 2, candidate: 'Bimal Patel', job: 'HR Specialist', interviewers: user?.email || 'Udaya', date: '2026-08-19, 02:00 PM', status: 'Scheduled', round: 'HR Screening' },
    { id: 3, candidate: 'Chetan Kumar', job: 'Final Round Lead', interviewers: 'Emily Brown', date: '2026-08-20, 03:30 PM', status: 'Completed', round: 'Final Review' },
    { id: 4, candidate: 'Divya Sharma', job: 'Frontend Developer', interviewers: 'John Doe', date: '2026-08-21, 11:00 AM', status: 'Scheduled', round: 'Coding' },
  ];

  const filteredInterviews = interviewsData.filter(item => {
    if (filter === 'ALL') return true;
    return item.status.toUpperCase() === filter;
  });

  return (
    <div className="content-section" style={{ margin: '32px' }}>
      <div className="section-header">
        <div>
          <h2>Interviews Management</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
            Schedule, track, and manage all candidate interview sessions.
          </p>
        </div>
        {['ADMIN', 'RECRUITER', 'COORDINATOR'].includes(user?.role) && (
          <button className="action-btn">+ Schedule Interview</button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['ALL', 'SCHEDULED', 'CONFIRMED', 'COMPLETED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: filter === status ? '#10b981' : '#ffffff',
              color: filter === status ? '#ffffff' : '#334155',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Job Title</th>
              <th>Round</th>
              <th>Interviewer(s)</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInterviews.length > 0 ? (
              filteredInterviews.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.candidate}</strong></td>
                  <td>{item.job}</td>
                  <td>{item.round}</td>
                  <td>{item.interviewers}</td>
                  <td>{item.date}</td>
                  <td>
                    <span className={`badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: '600', cursor: 'pointer', marginRight: '10px' }}>
                      View
                    </button>
                    {['ADMIN', 'RECRUITER'].includes(user?.role) && (
                      <button style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                  No interviews found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Interviews;