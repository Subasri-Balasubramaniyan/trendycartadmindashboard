import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios.js';
import './AdminLoginPage.css';
import loginBanner from '../../assets/admin/login-banner.jpg';
import logo from '../../assets/logo.png'; // adjust path if needed

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    
    if (adminToken && adminUser.role === 'admin') {
      navigate('/admin');
    }

    // Animation timer
    const timer = setTimeout(() => {
      document.querySelector('.admin-banner')?.classList.add('animate-banner');
      document.querySelector('.admin-login-form')?.classList.add('animate-form');
      document.querySelector('.admin-logo')?.classList.add('animate-logo');
    }, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Using direct URL instead of axios instance to avoid baseURL conflicts
      const response = await axios.post('http://localhost:5005/api/auth/admin/login', {
        email,
        password
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        // Store admin token and user info with separate keys
        localStorage.setItem('adminToken', response.data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.data));
        
        // Navigate to admin dashboard
        navigate('/admin');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-banner">
        <img src={loginBanner} alt="Admin Banner" />
      </div>
      <div className="admin-login-form">
        <img src={logo} alt="Trendy Cart Logo" className="admin-logo" />
        <h2>Admin Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Admin Password"  
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="admin-credentials-hint">
          <small>Default: admin@example.com / admin123</small>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
