import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import './Dashboard.css';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to extract user ID from token
  const getUserIdFromToken = () => {
    if (!user?.token) return null;
    try {
      const payload = JSON.parse(atob(user.token.split('.')[1]));
      return payload.id || payload.userId || payload.uid || payload.sub;
    } catch (e) {
      console.error("Error decoding token", e);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        setError("Could not identify user from session token.");
        setLoading(false);
        return;
      }

      try {
        const data = await userService.getUserById(userId);
        setProfileData(data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to load profile details from backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return <div className="content-section" style={{ margin: '32px', textAlign: 'center' }}>Loading profile settings...</div>;
  }

  return (
    <div className="content-section" style={{ margin: '32px' }}>
      <div className="section-header">
        <div>
          <h2>Account Settings</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
            Manage your profile details, view account credentials, and system preferences.
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', margin: '20px 0', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'profile' ? '#10b981' : '#f1f5f9',
            color: activeTab === 'profile' ? '#ffffff' : '#334155',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          My Profile
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'notifications' ? '#10b981' : '#f1f5f9',
            color: activeTab === 'notifications' ? '#ffffff' : '#334155',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Notifications (Coming Soon)
        </button>
        <button
          onClick={() => setActiveTab('auditlogs')}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'auditlogs' ? '#10b981' : '#f1f5f9',
            color: activeTab === 'auditlogs' ? '#ffffff' : '#334155',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Audit Logs (Coming Soon)
        </button>
      </div>

      {/* Tab Content */}
      {error && <div style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</div>}

      {activeTab === 'profile' && profileData && (
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
          <h3 style={{ marginBottom: '16px' }}>Profile Information</h3>
          <div style={{ marginBottom: '12px' }}>
            <strong>Full Name:</strong> {profileData.name || profileData.username || 'N/A'}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong>Email Address:</strong> {profileData.email || 'N/A'}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong>Assigned Role:</strong> <span className="badge confirmed">{profileData.role || profileData.roles || 'USER'}</span>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <strong>Account ID:</strong> {profileData.id}
          </div>
          <p style={{ color: '#64748b', fontSize: '13px' }}>
            To update your profile credentials or password, please contact your system administrator.
          </p>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '600px', color: '#64748b' }}>
          <h3>Notification Preferences</h3>
          <p>Email alert configurations and reminder schedules will be implemented here in a future update.</p>
        </div>
      )}

      {activeTab === 'auditlogs' && (
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '600px', color: '#64748b' }}>
          <h3>System Audit Logs</h3>
          <p>Tracking user activity, interview status modifications, and security event logs will be available soon.</p>
        </div>
      )}
    </div>
  );
};

export default Settings;