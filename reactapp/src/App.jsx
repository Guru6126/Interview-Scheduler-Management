import React from 'react';
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

function App() {
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
            </Route>
          </Route>

          {/* Admin Only Route */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/users" element={<Users />} />   
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;