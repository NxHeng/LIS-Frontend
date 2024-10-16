import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthNavbar from './components/Authentication/AuthNavbar';
import { useAuthContext } from './context/AuthContext';

const AuthRoutes = () => {

  const { user } = useAuthContext();

  // if (!user) {
  //   console.log("User not found, redirecting to login page");
  //   return <Navigate to="/login" />; // Redirect to login if not authenticated
  // }

  return (
    <>
      <AuthNavbar />
      <Outlet />
    </>
  );
};

export default AuthRoutes;
