import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const JobPosts = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('ALL');

  const jobPostsData = [
    { id: 1, title: 'Technical Engineer', department: 'Engineering', applicants: 45, status: 'Active', postedDate: '2026-08-01' },
    { id: 2, title: 'HR Specialist', department: 'Human Resources', applicants: 18, status: 'Active', postedDate: '2026-08-05' },
    { id: 3, title: 'Final Round Lead', department: 'Management', applicants: 8, status: 'Closed', postedDate: '2026-07-15' },
    { id: 4, title: 'Frontend Developer', department: 'Engineering', applicants: 32, status: 'Active', postedDate: '2026-08-10' },
  ];

  const filteredJobs = jobPostsData.filter(job => {
    if (filter === 'ALL') return true;
    return job.status.toUpperCase() === filter;
  });

  return (
    <div className="content-section" style={{ margin: '32px' }}>
      <div className="section-header">
        <div>
          <h2>Job Posts Management</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
            Manage open roles, track applicant counts, and create new job listings.
          </p>
        </div>
        {['ADMIN', 'RECRUITER'].includes(user?.role) && (
          <button className="action-btn">+ Create Job Post</button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['ALL', 'ACTIVE', 'CLOSED'].map(status => (
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
              <th>Job Title</th>
              <th>Department</th>
              <th>Applicants</th>
              <th>Posted Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td><strong>{job.title}</strong></td>
                  <td>{job.department}</td>
                  <td>{job.applicants} Candidates</td>
                  <td>{job.postedDate}</td>
                  <td>
                    <span className={`badge ${job.status === 'Active' ? 'confirmed' : 'completed'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <button style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: '600', cursor: 'pointer', marginRight: '10px' }}>
                      Edit
                    </button>
                    {['ADMIN', 'RECRUITER'].includes(user?.role) && (
                      <button style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}>
                        Close Post
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                  No job posts found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobPosts;