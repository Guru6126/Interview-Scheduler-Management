import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Helper to extract roles from token or user object
  // Helper to extract roles from token or user object
  const getUserRoles = () => {
    try {
      if (user?.token) {
        const payload = JSON.parse(atob(user.token.split('.')[1]));
        const roles = payload.roles || payload.role || [];
        
        // Strip 'ROLE_' prefix so "ROLE_ADMIN" becomes "ADMIN"
        return Array.isArray(roles) 
          ? roles.map(r => String(r).replace('ROLE_', '').toUpperCase()) 
          : [String(roles).replace('ROLE_', '').toUpperCase()];
      }
      if (user?.role) {
        return [String(user.role).replace('ROLE_', '').toUpperCase()];
      }
    } catch (e) {
      console.error("Error decoding token roles", e);
    }
    return [];
  };

  // If roles are specified, check if the user's role is permitted
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoles = getUserRoles();
    const hasPermission = allowedRoles.some(role => userRoles.includes(role.toUpperCase()));

    if (!hasPermission) {
      // Redirect unauthorized users back to dashboard instead of a blank/unauthorized page
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Render the child route components if authorized
  return <Outlet />;
};

export default ProtectedRoute;