// src/components/PrivateCustomerRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateCustomerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.role === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export default PrivateCustomerRoute;
