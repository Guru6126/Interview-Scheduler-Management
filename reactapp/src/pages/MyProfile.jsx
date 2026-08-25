import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import './Dashboard.css';

const MyProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize theme from localStorage or document class
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || document.body.classList.contains('dark-theme');
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      const themeName = next ? 'dark' : 'light';
      localStorage.setItem('theme', themeName);
      if (next) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
      return next;
    });
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // /me resolves identity from the JWT bearer token — no ID needed
        const data = await userService.getCurrentUser();
        setProfileData(data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to load profile details from backend.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="content-section" style={{ margin: '32px', textAlign: 'center' }}>Loading profile settings...</div>;
  }

  return (
    <div className="content-section" style={{ margin: '32px' }}>
      <div className="section-header" style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '16px', marginBottom: '24px' }}>
        <div>
          <h2>My Profile</h2>
          <p style={{ color: 'var(--muted-text, #64748b)', fontSize: '14px', margin: '4px 0 0 0' }}>
            Manage your personal profile information and customize your interface theme.
          </p>
        </div>
      </div>

      {error && <div style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</div>}

      {profileData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Profile Card */}
          <div style={{ 
            background: 'var(--card-bg)', 
            padding: '24px', 
            borderRadius: '8px', 
            border: '1px solid var(--card-border)',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--header-text)', fontSize: '18px', borderBottom: '1px solid var(--card-border)', paddingBottom: '10px' }}>
              Profile Information
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: 'var(--muted-text, #64748b)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                Full Name
              </div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>
                {
                  (profileData.firstName || profileData.lastName)
                    ? `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim()
                    : profileData.email
                      ? profileData.email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase())
                      : 'N/A'
                }
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: 'var(--muted-text, #64748b)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                Email Address
              </div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>
                {profileData.email || 'N/A'}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: 'var(--muted-text, #64748b)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                Assigned Role
              </div>
              <div style={{ marginTop: '4px' }}>
                <span className="badge confirmed" style={{ fontSize: '13px', padding: '6px 12px' }}>
                  {profileData.role || profileData.roles || 'USER'}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ color: 'var(--muted-text, #64748b)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                Employee ID
              </div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>
                {profileData.employeeId || profileData.empId || profileData.id}
              </div>
            </div>

            <p style={{ color: 'var(--muted-text, #64748b)', fontSize: '13px', borderTop: '1px solid var(--card-border)', paddingTop: '12px', margin: '0' }}>
              To update your account credentials, please contact your system administrator.
            </p>
          </div>

          {/* Theme Settings Card */}
          <div style={{ 
            background: 'var(--card-bg)', 
            padding: '24px', 
            borderRadius: '8px', 
            border: '1px solid var(--card-border)',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ marginBottom: '20px', color: 'var(--header-text)', fontSize: '18px', borderBottom: '1px solid var(--card-border)', paddingBottom: '10px' }}>
                Preferences
              </h3>
              <p style={{ color: 'var(--muted-text, #64748b)', fontSize: '14px', marginBottom: '24px' }}>
                Customize your visual theme mode. This configuration is stored locally and will persist automatically.
              </p>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '8px',
                background: 'var(--bg-color)',
                border: '1px solid var(--card-border)'
              }}>
                <span style={{ fontWeight: '600', fontSize: '15px' }}>
                  {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </span>
                
                {/* Custom Toggle Switch */}
                <button 
                  onClick={toggleTheme}
                  style={{
                    position: 'relative',
                    width: '60px',
                    height: '32px',
                    borderRadius: '20px',
                    background: isDark ? '#10b981' : '#cbd5e1',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'background-color 0.3s ease',
                    padding: '0'
                  }}
                  aria-label="Toggle theme"
                >
                  <div style={{
                    position: 'absolute',
                    top: '3px',
                    left: isDark ? '31px' : '3px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'left 0.3s ease'
                  }} />
                </button>
              </div>
            </div>

            <div style={{ marginTop: '24px', fontSize: '12px', color: 'var(--muted-text, #64748b)', textAlign: 'center' }}>
              System version: 1.0.0
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
