import { UrlState } from '@/Context';
import React from 'react'
import { Navigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = UrlState();

  if (loading) {
    return <BarLoader width="100%" color="#36d7b7" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default RequireAuth;