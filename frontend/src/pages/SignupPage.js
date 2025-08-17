import React, { useState } from 'react';
import axios from '../api/axios.js';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import logo from '../assets/logo.png';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        '/auth/register',
        { 
          ...formData, 
          role: 'customer',
          confirmPassword: formData.password
        },
        { timeout: 5000 }
      );

      if (res.status === 200 || res.status === 201) {
        alert('Registration successful! Redirecting to login...');
        navigate('/');
      } else {
        alert('Unexpected response. Try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'ECONNABORTED') {
        alert('Server timeout. Try again later.');
      } else if (error.response) {
        alert(error.response.data.message || 'Signup failed.');
      } else {
        alert('Network error. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper no-banner">
      <div className="signup-form-glass">
        {/* <img src={logo} alt="Trendy Cart Logo" className="signup-logo" /> */}
        <h2>
          Sign Up for <span className="highlight">Trendy Cart</span>
        </h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="switch-login">
          Already have an account?{' '}
          <a onClick={() => navigate('/')}>Login</a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
