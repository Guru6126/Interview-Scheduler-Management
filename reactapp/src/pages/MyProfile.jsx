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

  // Initialize font preferences from localStorage or defaults
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || '14px';
  });

  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem('fontFamily') || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  });

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    localStorage.setItem('fontSize', newSize);
    document.documentElement.style.setProperty('--app-font-size', newSize);
  };

  const handleFontFamilyChange = (newFamily) => {
    setFontFamily(newFamily);
    localStorage.setItem('fontFamily', newFamily);
    document.documentElement.style.setProperty('--app-font-family', newFamily);
  };

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

          {/* Preferences & Appearance Card */}
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
                Appearance & Customization
              </h3>
              <p style={{ color: 'var(--muted-text, #64748b)', fontSize: '14px', marginBottom: '20px' }}>
                Customize your interface theme, font style, and font sizing. Settings are saved locally and applied globally.
              </p>

              {/* Theme Mode Toggle */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '8px',
                background: 'var(--bg-color)',
                border: '1px solid var(--card-border)',
                marginBottom: '16px'
              }}>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>
                  {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </span>
                
                <button 
                  onClick={toggleTheme}
                  style={{
                    position: 'relative',
                    width: '56px',
                    height: '28px',
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
                    top: '2px',
                    left: isDark ? '29px' : '2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'left 0.3s ease'
                  }} />
                </button>
              </div>

              {/* Font Size Selector */}
              <div style={{ 
                padding: '14px 16px',
                borderRadius: '8px',
                background: 'var(--bg-color)',
                border: '1px solid var(--card-border)',
                marginBottom: '16px'
              }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--header-text)' }}>
                  🔤 Font Size
                </label>
                <select 
                  value={fontSize} 
                  onChange={(e) => handleFontSizeChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--text-color)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="12px">Small (12px)</option>
                  <option value="14px">Medium (14px - Default)</option>
                  <option value="16px">Large (16px)</option>
                  <option value="18px">Extra Large (18px)</option>
                </select>
              </div>

              {/* Font Family Selector */}
              <div style={{ 
                padding: '14px 16px',
                borderRadius: '8px',
                background: 'var(--bg-color)',
                border: '1px solid var(--card-border)'
              }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--header-text)' }}>
                  🎨 Font Style
                </label>
                <select 
                  value={fontFamily} 
                  onChange={(e) => handleFontFamilyChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--text-color)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI (Default)</option>
                  <option value="'Inter', -apple-system, BlinkMacSystemFont, sans-serif">Inter / Sans-Serif</option>
                  <option value="'Roboto', Arial, sans-serif">Roboto</option>
                  <option value="Consolas, 'Courier New', monospace">Monospace</option>
                  <option value="Georgia, serif">Georgia (Serif)</option>
                </select>
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
