import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaLock, FaEye, FaSpinner } from 'react-icons/fa';
import axios from '../api/axios.js';
import './ProfileManagementPage.css';

const ProfileManagementPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    } else if (user.first_name) {
      setProfile({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || ''
      });
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchUserOrders();
    }
  }, [activeTab]);

  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    setError('');
    
    try {
      const customerToken = localStorage.getItem('token');
      
      if (!customerToken) {
        setError('Please log in to view your orders');
        return;
      }

      const response = await axios.get('/orders', {
        headers: {
          'Authorization': `Bearer ${customerToken}`
        }
      });

      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 401) {
        setError('Please log in again to view your orders');
      } else {
        setError('Failed to fetch orders. Please try again later.');
      }
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (!profile.first_name || !profile.last_name || !profile.email) {
      setError('All fields are required.');
      return;
    }
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setMessage('Profile updated successfully.');
    setError('');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    const { current, newPass, confirm } = passwords;
    if (!current || !newPass || !confirm) {
      setError('Please fill out all password fields.');
      return;
    }
    if (newPass !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    setMessage('Password changed successfully');
    setError('');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const handleViewOrderDetails = (orderId) => {
    navigate(`/track-order/${orderId}`);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const customerToken = localStorage.getItem('token');
      await axios.patch(`/orders/${orderId}/cancel`, {}, {
        headers: {
          'Authorization': `Bearer ${customerToken}`
        }
      });

      setMessage('Order cancelled successfully');
      fetchUserOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('Failed to cancel order. Please try again.');
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'shipped': return 'status-shipped';
      case 'out for delivery': return 'status-shipped';
      case 'processing': return 'status-processing';
      case 'pending': return 'status-processing';
      case 'cancelled': return 'status-cancelled';
      case 'returned': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const renderProfileTab = () => (
    <form className="profile-form" onSubmit={handleSaveChanges}>
      <h3>Profile Settings</h3>
      <label>First Name:</label>
      <input
        type="text"
        name="first_name"
        value={profile.first_name}
        onChange={handleProfileChange}
        required
      />
      <label>Last Name:</label>
      <input
        type="text"
        name="last_name"
        value={profile.last_name}
        onChange={handleProfileChange}
        required
      />
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={profile.email}
        onChange={handleProfileChange}
        required
      />
      <button type="submit">Save Changes</button>
    </form>
  );

  const renderOrdersTab = () => (
    <div className="orders-section">
      <h3>My Orders</h3>
      {loadingOrders ? (
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/products')} className="shop-now-btn">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h4>Order #{order._id.slice(-8)}</h4>
                <span className={`order-status ${getStatusClass(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="order-details">
                <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                <p><strong>Items:</strong> {order.orderItems.length}</p>
                <p><strong>Total:</strong> {formatPrice(order.totalPrice)}</p>
                {order.trackingNumber && (
                  <p><strong>Tracking:</strong> {order.trackingNumber}</p>
                )}
                <p><strong>Payment:</strong> {order.paymentMethod}</p>
                <div className="order-items">
                  <strong>Items:</strong>
                  {order.orderItems.slice(0, 2).map((item, index) => (
                    <span key={index} className="order-item-name">
                      {item.name} x{item.quantity}
                      {index < Math.min(order.orderItems.length - 1, 1) ? ', ' : ''}
                    </span>
                  ))}
                  {order.orderItems.length > 2 && (
                    <span className="more-items">
                      {' '}+{order.orderItems.length - 2} more
                    </span>
                  )}
                </div>
              </div>
              <div className="order-actions">
                <button 
                  onClick={() => handleViewOrderDetails(order._id)}
                  className="view-details-btn"
                >
                  <FaEye /> View Details
                </button>
                {order.orderStatus === 'Delivered' && (
                  <button className="reorder-btn">
                    Reorder
                  </button>
                )}
                {['Pending', 'Processing'].includes(order.orderStatus) && (
                  <button 
                    className="cancel-order-btn"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPasswordTab = () => (
    <form className="password-form" onSubmit={handleChangePassword}>
      <h3>Password Settings</h3>
      <label>Current Password:</label>
      <input
        type="password"
        name="current"
        placeholder="Current"
        value={passwords.current}
        onChange={handlePasswordChange}
      />
      <label>New Password:</label>
      <input
        type="password"
        name="newPass"
        placeholder="New"
        value={passwords.newPass}
        onChange={handlePasswordChange}
      />
      <label>Confirm Password:</label>
      <input
        type="password"
        name="confirm"
        placeholder="Confirm"
        value={passwords.confirm}
        onChange={handlePasswordChange}
      />
      <button type="submit">Change Password</button>
    </form>
  );

  return (
    <div className="profile-container">
      <h2>My Account</h2>
      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaUser /> Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FaShoppingBag /> My Orders
        </button>
        <button 
          className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <FaLock /> Security
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'orders' && renderOrdersTab()}
        {activeTab === 'password' && renderPasswordTab()}
      </div>
    </div>
  );
};

export default ProfileManagementPage;
