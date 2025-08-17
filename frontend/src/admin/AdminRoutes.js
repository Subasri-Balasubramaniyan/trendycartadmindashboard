// src/admin/AdminRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";

// Admin Pages
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProductManagementPage from "./pages/ProductManagementPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";

import OrderManagementPage from "./pages/OrderManagementPage";
import AddOrderPage from "./pages/AddOrderPage";
import EditOrderPage from "./pages/EditOrderPage";

import CustomerManagementPage from "./pages/CustomerManagementPage";
import AddCustomerPage from "./pages/AddCustomerPage";
import EditCustomerPage from "./pages/EditCustomerPage";

import CustomerBrandingSettingsPage from "./pages/CustomerBrandingSettingsPage"; // ✅ Corrected import name
import AdminLoginPage from "./pages/AdminLoginPage";

import AdminLayout from "./components/AdminLayout";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Protected Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<ProductManagementPage />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />

        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="orders/add" element={<AddOrderPage />} />
        <Route path="orders/edit/:id" element={<EditOrderPage />} />

        <Route path="customers" element={<CustomerManagementPage />} />
        <Route path="customers/add" element={<AddCustomerPage />} />
        <Route path="customers/edit/:id" element={<EditCustomerPage />} />

        {/* ✅ Updated path */}
        <Route path="settings/customerbranding" element={<CustomerBrandingSettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
