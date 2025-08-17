import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import "./AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout-container">
      <AdminNavbar />
      <main className="admin-main" style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
