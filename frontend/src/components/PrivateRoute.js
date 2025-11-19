import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/pos" replace />;
  }

  if (role === 'employee' && user.role !== 'admin' && user.role !== 'employee') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

