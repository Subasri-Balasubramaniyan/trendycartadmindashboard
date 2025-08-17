// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import axios from '../api/axios.js';
import { Link } from 'react-router-dom';
import './ForgotPasswordPage.css'; // Make sure this file exists and is linked

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/auth/forgot-password', { email });
      setMessage('✅ Password reset link sent to your email.');
      setError('');
    } catch (err) {
      setError('❌ Failed to send reset link. Please check your email.');
      setMessage('');
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="signup-container">
        <h2>Forgot Password</h2>

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>

        <div className="login-link-text">
          Remembered your password?{' '}
          <Link to="/" className="login-link">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
