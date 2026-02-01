import { UrlState } from '@/Context';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = UrlState();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) return <BarLoader width="100%" color="#36d7b7" />;
  if (!isAuthenticated) return null;

  return children;
};


export default RequireAuth;