import React from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '@/services/api';

export default function PrivateRoute({ children }) {
  const isAuthenticated = api.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
