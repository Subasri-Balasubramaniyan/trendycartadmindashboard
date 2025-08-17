// src/admin/components/AdminSidebar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="admin-sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        &#9776;
      </div>

      <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <h2>TrendyCart Admin</h2>
        <nav>
          <Link to="/admin/dashboard" className={pathname.includes("dashboard") ? "active" : ""}>Dashboard</Link>
          <Link to="/admin/products" className={pathname.includes("products") ? "active" : ""}>Manage Products</Link>
          <Link to="/admin/orders" className={pathname.includes("orders") ? "active" : ""}>Manage Orders</Link>
          <Link to="/admin/customers" className={pathname.includes("customers") ? "active" : ""}>Manage Customers</Link>
          <Link to="/admin/settings/branding" className={pathname.includes("branding") ? "active" : ""}>Branding Settings</Link>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
