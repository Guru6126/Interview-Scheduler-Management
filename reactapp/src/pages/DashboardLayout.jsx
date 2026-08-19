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

  // Robust role extraction handling both direct role property and JWT token payloads
  const getUserRoleString = () => {
    if (user?.role) {
      return String(user.role).toUpperCase();
    }
    if (user?.token) {
      try {
        const payload = JSON.parse(atob(user.token.split('.')[1]));
        const roles = payload.roles || payload.role || '';
        if (Array.isArray(roles)) {
          return roles.join(',').toUpperCase();
        }
        return String(roles).toUpperCase();
      } catch (e) {
        console.error("Could not decode token", e);
      }
    }
    return '';
  };

  const roleString = getUserRoleString();
  const isAdmin = roleString.includes('ADMIN');
  const isCoordinator = roleString.includes('COORDINATOR');

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h2>Interview Scheduling & Feedback Management</h2>
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
          
          <li 
            className={location.pathname === '/jobposts' ? 'active' : ''} 
            onClick={() => navigate('/jobposts')}
          >
            Job Posts
          </li>

          {/* Users Management: Visible for ADMIN and COORDINATOR roles */}
          {(isAdmin || isCoordinator) && (
            <li 
              className={location.pathname === '/users' ? 'active' : ''} 
              onClick={() => navigate('/users')}
            >
              Users
            </li>
          )}

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