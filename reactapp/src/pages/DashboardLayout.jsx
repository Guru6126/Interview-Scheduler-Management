import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Normalize role to uppercase to prevent case mismatch issues
  const userRole = user?.role ? user.role.toUpperCase() : '';

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h2>Interview System</h2>
        </div>
        <ul className="sidebar-menu">
          <li 
            className={location.pathname === '/dashboard' ? 'active' : ''} 
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </li>
          <li 
            className={location.pathname === '/interviews' ? 'active' : ''} 
            onClick={() => navigate('/interviews')}
          >
            Interviews
          </li>
          <li 
            className={location.pathname === '/candidates' ? 'active' : ''} 
            onClick={() => navigate('/candidates')}
          >
            Candidates
          </li>
          
          {/* Job Posts is now permanently visible in the sidebar */}
          <li 
            className={location.pathname === '/jobposts' ? 'active' : ''} 
            onClick={() => navigate('/jobposts')}
          >
            Job Posts
          </li>

          <li 
            className={location.pathname === '/settings' ? 'active' : ''} 
            onClick={() => navigate('/settings')}
          >
            Settings
          </li>
        </ul>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;