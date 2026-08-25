import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';
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
        <div className="sidebar-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
          <img
            src={logoImg}
            alt="SlotScore Logo"
            style={{
              width: '140px',
              height: '140px',
              objectFit: 'contain',
              marginBottom: '-10px',
              marginTop: '-30px'
            }}
          />
          <h2 style={{
            margin: '0 0 40px 0',
            fontSize: '16px',
            letterSpacing: '0.5px',
            color: '#f2f5f4ff',
            lineHeight: '1.4',
            fontWeight: '750'
          }}>
            Interview Scheduling and Feedback Management Application
          </h2>
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

          {/* Users Management: Visible for ADMIN role */}
          {isAdmin && (
            <li
              className={location.pathname === '/users' ? 'active' : ''}
              onClick={() => navigate('/users')}
            >
              Users
            </li>
          )}

          <li
            className={location.pathname === '/profile' ? 'active' : ''}
            onClick={() => navigate('/profile')}
          >
            My Profile
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