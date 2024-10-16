import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuthContext } from './context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuthContext(); // Use the authentication context

  if (!user) {
    console.log("User not found, redirecting to login page");
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
