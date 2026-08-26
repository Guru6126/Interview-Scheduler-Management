import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './pages/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates'; 
import Interviews from './pages/Interviews';
import JobPosts from './pages/JobPosts';
import Users from './pages/Users'; 
import MyProfile from './pages/MyProfile'; 
import Availability from './pages/Availability';
import JobApplications from './pages/JobApplications';
import AuditLogs from './pages/AuditLogs'; 

function App() {
  // Apply saved theme and font preferences immediately on app mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    const savedFontSize = localStorage.getItem('fontSize') || '14px';
    const savedFontFamily = localStorage.getItem('fontFamily') || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

    document.documentElement.style.setProperty('--app-font-size', savedFontSize);
    document.documentElement.style.setProperty('--app-font-family', savedFontFamily);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* General Protected Routes (Any logged-in user can access) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/interviews" element={<Interviews />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/jobposts" element={<JobPosts />} />
              <Route path="/availability" element={<Availability />} />
              <Route path="/applications" element={<JobApplications />} />
              <Route path="/profile" element={<MyProfile />} /> 
            </Route>
          </Route>

          {/* Admin Only Route */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/users" element={<Users />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;