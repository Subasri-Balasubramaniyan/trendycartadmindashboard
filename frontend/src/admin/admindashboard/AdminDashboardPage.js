import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
  FaCog,
  FaShippingFast,
  FaCheckCircle,
  FaSpinner
} from "react-icons/fa";
import axios from "../../api/axios.js";
import "./AdminDashboardPage.css";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    deliveredOrders: 0,
    shippedOrders: 0,
    processingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Fetch products count
      const productsResponse = await axios.get('/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch users count
      const usersResponse = await axios.get('/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => ({ data: { data: [] } })); // Fallback if endpoint doesn't exist
      
      // Fetch orders count
      const ordersResponse = await axios.get('/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => ({ data: { data: [] } })); // Fallback if endpoint doesn't exist

      const products = productsResponse.data.data || [];
      const users = usersResponse.data.data || [];
      const orders = ordersResponse.data.data || [];

      // Calculate order stats
      const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
      const shippedOrders = orders.filter(order => order.status === 'shipped').length;
      const processingOrders = orders.filter(order => order.status === 'processing').length;

      setStats({
        totalProducts: products.length,
        totalCustomers: users.length,
        totalOrders: orders.length,
        deliveredOrders,
        shippedOrders,
        processingOrders,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="admin-dashboard-title">Welcome, Admin!</h2>

      {loading ? (
        <div className="loading-message">Loading dashboard stats...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <FaBoxOpen className="stat-icon" />
              <div>
                <h3>{stats.totalProducts}</h3>
                <p>Total Products</p>
              </div>
            </div>

            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <div>
                <h3>{stats.totalCustomers}</h3>
                <p>Total Customers</p>
              </div>
            </div>

            <div className="stat-card">
              <FaShoppingCart className="stat-icon" />
              <div>
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>

            <div className="stat-card">
              <FaCheckCircle className="stat-icon green" />
              <div>
                <h3>{stats.deliveredOrders}</h3>
                <p>Delivered</p>
              </div>
            </div>

            <div className="stat-card">
              <FaShippingFast className="stat-icon blue" />
              <div>
                <h3>{stats.shippedOrders}</h3>
                <p>Shipped</p>
              </div>
            </div>

            <div className="stat-card">
              <FaSpinner className="stat-icon gray" />
              <div>
                <h3>{stats.processingOrders}</h3>
                <p>Processing</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Navigation Cards */}
      <div className="manage-section">
        <h3>Manage</h3>
        <div className="manage-grid">
          <Link to="/admin/products" className="manage-card">
            <FaBoxOpen className="manage-icon" />
            <p>Products</p>
          </Link>

          <Link to="/admin/orders" className="manage-card">
            <FaShoppingCart className="manage-icon" />
            <p>Orders</p>
          </Link>

          <Link to="/admin/customers" className="manage-card">
            <FaUsers className="manage-icon" />
            <p>Customers</p>
          </Link>

          <Link to="/admin/settings" className="manage-card">
            <FaCog className="manage-icon" />
            <p>Settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
