// src/admin/components/PrivateAdminRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({ children }) => {
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || '{}');
  const adminToken = localStorage.getItem("adminToken");

  if (!adminUser || adminUser.role !== "admin" || !adminToken) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default PrivateAdminRoute;
