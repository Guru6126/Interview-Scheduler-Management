import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo2.png';
import { notificationService } from '../services/notificationService';
import './Dashboard.css';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

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

  const getUserId = () => {
    if (user?.userId) return user.userId;        // from new login response field
    if (user?.id) return user.id;                // legacy fallback
    if (user?.token) {
      try {
        const payload = JSON.parse(atob(user.token.split('.')[1]));
        return payload.userId || payload.id;     // from JWT claims
      } catch (e) {}
    }
    return null;
  };

  const userId = getUserId();

  useEffect(() => {
    if (userId) {
      loadNotifications();
      // Poll notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getUserNotifications(userId);
      setNotifications(data || []);
    } catch (e) {
      console.error("Failed to load notifications", e);
    }
  };

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      loadNotifications();
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }
  };

  const roleString = getUserRoleString();
  const isAdmin = roleString.includes('ADMIN');
  const isCoordinator = roleString.includes('COORDINATOR');
  const isRecruiter = roleString.includes('RECRUITER');
  const isInterviewer = roleString.includes('INTERVIEWER') && !isAdmin && !isRecruiter && !isCoordinator;
  const canSeeApplications = isAdmin || isRecruiter || isCoordinator;
  const canSeeCandidates = !isInterviewer;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTokenPayload = () => {
    if (!user?.token) return {};
    try { return JSON.parse(atob(user.token.split('.')[1])); } catch { return {}; }
  };
  const tokenPayload = getTokenPayload();
  const displayName = user?.firstName || tokenPayload.firstName || user?.email?.split('@')[0] || 'User';

  const getRoleBadge = () => {
    if (isAdmin) return { label: 'ADMINISTRATOR', color: '#ef4444', bg: '#fee2e2' };
    if (isRecruiter) return { label: 'RECRUITER', color: '#3b82f6', bg: '#dbeafe' };
    if (isCoordinator) return { label: 'COORDINATOR', color: '#f59e0b', bg: '#fef3c7' };
    if (roleString.includes('INTERVIEWER')) return { label: 'INTERVIEWER', color: '#8b5cf6', bg: '#ede9fe' };
    return { label: 'USER', color: '#64748b', bg: '#f1f5f9' };
  };
  const badge = getRoleBadge();

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
            color: '#10b981',
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
            className={location.pathname === '/jobposts' ? 'active' : ''}
            onClick={() => navigate('/jobposts')}
          >
            Job Posts
          </li>

          {canSeeCandidates && (
            <li
              className={location.pathname === '/candidates' ? 'active' : ''}
              onClick={() => navigate('/candidates')}
            >
              Candidates
            </li>
          )}

          {canSeeApplications && (
            <li
              className={location.pathname === '/applications' ? 'active' : ''}
              onClick={() => navigate('/applications')}
            >
              Applications
            </li>
          )}

          <li
            className={location.pathname === '/availability' ? 'active' : ''}
            onClick={() => navigate('/availability')}
          >
            Availability
          </li>

          <li
            className={location.pathname === '/interviews' ? 'active' : ''}
            onClick={() => navigate('/interviews')}
          >
            Interviews
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

          {isAdmin && (
            <li
              className={location.pathname === '/audit-logs' ? 'active' : ''}
              onClick={() => navigate('/audit-logs')}
            >
              Audit Logs
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

      <main className="dashboard-main" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <header className="top-bar" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 32px',
          background: 'var(--header-bg, #ffffff)',
          borderBottom: '1px solid var(--header-border, #e2e8f0)',
          position: 'relative'
        }}>
          {/* Left Greeting & Role Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--header-text, #0f172a)' }}>
                Welcome back, {displayName} 👋
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                Here's what's happening in your workspace today.
              </p>
            </div>
            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: badge.bg, color: badge.color, letterSpacing: '0.5px' }}>
              {badge.label}
            </span>
          </div>
          {/* Notification Bell Icon */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowDropdown(!showDropdown)}>
            <span style={{ fontSize: '22px' }}>🔔</span>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#fff',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {unreadCount}
              </span>
            )}
            
            {/* Floating Dropdown Panel */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '36px',
                right: 0,
                width: '320px',
                background: 'var(--card-bg, #ffffff)',
                border: '1px solid var(--card-border, #cbd5e1)',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                zIndex: 1000,
                maxHeight: '360px',
                overflowY: 'auto'
              }} onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: '12px', borderBottom: '1px solid var(--card-border, #cbd5e1)', fontWeight: 'bold', color: 'var(--header-text, #0f172a)' }}>
                  Notifications
                </div>
                <div style={{ padding: '4px 0' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>No alerts</div>
                  ) : (
                    notifications.map(item => (
                      <div key={item.id} style={{
                        padding: '12px',
                        borderBottom: '1px solid var(--card-border, #f1f5f9)',
                        background: item.isRead ? 'transparent' : 'rgba(16, 185, 129, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-color, #1e293b)' }}>{item.title}</span>
                          {!item.isRead && (
                            <button
                              onClick={(e) => handleMarkAsRead(e, item.id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#10b981',
                                fontSize: '11px',
                                cursor: 'pointer',
                                padding: '2px 6px',
                                fontWeight: 'bold'
                              }}
                            >
                              ✓
                            </button>
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>{item.message}</p>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                          {item.createdDate ? new Date(item.createdDate).toLocaleString() : ''}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;