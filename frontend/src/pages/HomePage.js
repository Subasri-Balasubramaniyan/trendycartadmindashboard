import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios.js';
import './HomePage.css';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';

const HomePage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const customerToken = localStorage.getItem('token');
    const customerUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Only redirect if it's a customer token (not admin)
    if (customerToken && customerUser.role === 'customer') {
      // User is already logged in, redirect to products page
      navigate('/products');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setError('');

    try {
      const { data } = await axios.post('/auth/login', { email, password });
      
      // Check if the user is an admin
      if (data.data.role === 'admin' || data.data.role === 'seller') {
        setError('Admin users cannot login here. Please use the admin login page.');
        return;
      }
      
      // Only allow customers to login
      if (data.data.role !== 'customer') {
        setError('Only customers can login here. Please contact support if you need assistance.');
        return;
      }
      
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      setShowPopup(true);
      setTimeout(() => navigate('/products'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <div className="login-banner">
            <img src="/images/banners/homepage1.jpg" alt="Homepage Banner" />
          </div>

          <div className="login-box">
            <img src={logo} alt="Trendy Cart Logo" className="login-logo" />
            <h2 className="login-title">Welcome to Trendy Cart</h2>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={loggingIn}>
                {loggingIn ? 'Logging in...' : 'Login'}
              </button>
              {error && <p className="error-text">{error}</p>}
            </form>

            <div className="login-links">
              <p>
                Don't have an account?{' '}
                <span className="link-text" onClick={() => navigate('/signup')}>
                  Create Account
                </span>
              </p>
              <p>
                <span className="link-text" onClick={() => navigate('/forgot-password')}>
                  Forgot Password?
                </span>
              </p>
              <p>
                Admin user?{' '}
                <span className="link-text" onClick={() => navigate('/admin/login')}>
                  Admin Login
                </span>
              </p>
            </div>
          </div>
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              <p>Login Successful! Redirecting...</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default HomePage;
