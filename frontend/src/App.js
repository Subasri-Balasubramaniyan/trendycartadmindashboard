import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProfileManagementPage from "./pages/ProfileManagementPage";
import ProductListingPage from "./customer/pages/ProductListingPage";
import CartPage from "./customer/pages/CartPage";
import CheckoutPage from "./customer/pages/CheckoutPage";
import OrderConfirmationPage from "./customer/pages/OrderConfirmationPage";
import OrderHistoryPage from "./customer/pages/OrderHistoryPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivateRoute from "./components/PrivateRoute";
import TrackOrderMapPage from "./customer/pages/TrackOrderMapPage";

import AdminLayout from "./admin/components/AdminLayout";
import PrivateAdminRoute from "./admin/components/PrivateAdminRoute";
import AdminDashboardPage from "./admin/admindashboard/AdminDashboardPage";
import ProductManagementPage from "./admin/pages/ProductManagementPage";
import AddProductPage from "./admin/pages/AddProductPage";
import OrderManagementPage from "./admin/pages/OrderManagementPage";
import AddOrderPage from "./admin/pages/AddOrderPage";
import EditOrderPage from "./admin/pages/EditOrderPage";
import CustomerManagementPage from "./admin/pages/CustomerManagementPage";
import CustomerBrandingSettingsPage from "./admin/pages/CustomerBrandingSettingsPage";
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import EditProductPage from "./admin/pages/EditProductPage";
import AddCustomerPage from "./admin/pages/AddCustomerPage";
import EditCustomerPage from "./admin/pages/EditCustomerPage";

function AppWrapper() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Render Header only on non-admin routes */}
      {!isAdminRoute && <Header />}

      <Routes>
        {/* Customer & Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Customer protected */}
        <Route path="/profile" element={<PrivateRoute><ProfileManagementPage /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><ProductListingPage /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
        <Route path="/order-confirmation" element={<PrivateRoute><OrderConfirmationPage /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><OrderHistoryPage /></PrivateRoute>} />
        <Route path="/track-order/:orderId" element={<PrivateRoute><TrackOrderMapPage /></PrivateRoute>} />

        {/* Admin login without layout */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin routes with AdminLayout */}
        <Route path="/admin" element={<PrivateAdminRoute><AdminLayout /></PrivateAdminRoute>}>
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

          <Route path="settings" element={<CustomerBrandingSettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
