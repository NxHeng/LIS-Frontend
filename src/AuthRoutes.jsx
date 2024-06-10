import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthNavbar from './components/Authentication/AuthNavbar';

const AuthRoutes = () => {

//   if (!user) {
//     return <Navigate to="/login" />; // Redirect to login if not authenticated
//   }

  return (
    <>
      <AuthNavbar />
      <Outlet />
    </>
  );
};

export default AuthRoutes;
