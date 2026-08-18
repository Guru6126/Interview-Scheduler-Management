import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-based helper titles or greetings
  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return 'Administrator';
      case 'RECRUITER': return 'Recruiter';
      case 'INTERVIEWER': return 'Interviewer';
      case 'COORDINATOR': return 'Coordinator';
      default: return 'User';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h2>Interview Scheduling and Feedback Management System</h2>
        </div>
        <ul className="sidebar-menu">
          <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </li>
          <li className={activeTab === 'interviews' ? 'active' : ''} onClick={() => setActiveTab('interviews')}>
            Interviews
          </li>
          <li className={activeTab === 'candidates' ? 'active' : ''} onClick={() => setActiveTab('candidates')}>
            Candidates
          </li>
          {['ADMIN', 'RECRUITER'].includes(user?.role) && (
            <li className={activeTab === 'jobposts' ? 'active' : ''} onClick={() => setActiveTab('jobposts')}>
              Job Posts
            </li>
          )}
          <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            Settings
          </li>
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Dashboard</h2>
            <span className="role-tag">{getRoleBadge(user?.role)}</span>
          </div>
          <div className="user-profile">
            <span>Welcome, <strong>{user?.email || 'User'}</strong></span>
          </div>
        </header>

        {/* Dynamic Metric Cards based on Role */}
        <section className="metrics-grid">
          <div className="metric-card primary-card">
            <h4>Total Interviews (This Month)</h4>
            <p className="metric-value">217</p>
            <span className="metric-trend">↑ 12% vs last month</span>
          </div>

          {['ADMIN', 'RECRUITER'].includes(user?.role) && (
            <div className="metric-card">
              <h4>Active Job Posts</h4>
              <p className="metric-value">48</p>
            </div>
          )}

          {['ADMIN', 'RECRUITER', 'COORDINATOR'].includes(user?.role) && (
            <div className="metric-card">
              <h4>Candidate Pool</h4>
              <p className="metric-value">9,845</p>
            </div>
          )}

          <div className="metric-card">
            <h4>Feedback Status</h4>
            <p className="metric-value pending-val">Pending: 15</p>
          </div>
        </section>

        {/* Upcoming Interviews Table Section */}
        <section className="content-section">
          <div className="section-header">
            <h3>Upcoming Interviews</h3>
            {['ADMIN', 'RECRUITER', 'COORDINATOR'].includes(user?.role) && (
              <button className="action-btn">+ Create Interview</button>
            )}
          </div>
          
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Job Title</th>
                  <th>Interviewer(s)</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Aadhya Nair</td>
                  <td>Technical Engineer</td>
                  <td>John Doe, Jane Smith</td>
                  <td>2026-08-19, 10:00 AM</td>
                  <td><span className="badge confirmed">Confirmed</span></td>
                </tr>
                <tr>
                  <td>Bimal Patel</td>
                  <td>HR Specialist</td>
                  <td>{user?.email || 'Udaya'}</td>
                  <td>2026-08-19, 02:00 PM</td>
                  <td><span className="badge scheduled">Scheduled</span></td>
                </tr>
                <tr>
                  <td>Chetan Kumar</td>
                  <td>Final Round Lead</td>
                  <td>Emily Brown</td>
                  <td>2026-08-20, 03:30 PM</td>
                  <td><span className="badge completed">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Interview Feedback Section */}
        <section className="content-section">
          <div className="section-header">
            <h3>Recent Interview Feedback</h3>
            <button className="action-btn">+ Submit Feedback</button>
          </div>
          
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Interviewer</th>
                  <th>Rating</th>
                  <th>Comments</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Aadhya Nair</td>
                  <td>John Doe</td>
                  <td>⭐ 4.5 / 5</td>
                  <td>Strong technical skills and clear communication.</td>
                  <td><span className="badge confirmed">Submitted</span></td>
                </tr>
                <tr>
                  <td>Bimal Patel</td>
                  <td>{user?.email || 'Udaya'}</td>
                  <td>⭐ 4.0 / 5</td>
                  <td>Good cultural fit, answers were structured well.</td>
                  <td><span className="badge confirmed">Submitted</span></td>
                </tr>
                <tr>
                  <td>Chetan Kumar</td>
                  <td>Emily Brown</td>
                  <td>—</td>
                  <td>Feedback evaluation pending submission.</td>
                  <td><span className="badge scheduled">Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;