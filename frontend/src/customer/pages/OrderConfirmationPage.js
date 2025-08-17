import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const [name, setName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 🔒 Redirect if not logged in as customer
  useEffect(() => {
    const customerToken = localStorage.getItem('token');
    const customerUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!customerToken || customerUser.role !== 'customer') {
      alert('You must be logged in as a customer to confirm an order.');
      navigate('/'); // Redirect to login or homepage
    }
  }, [navigate]);

  const handleConfirm = () => {
    if (!name || !shippingAddress || !contactNumber) {
      setError('Please fill in all fields.');
      return;
    }

    // Save to localStorage (simulate order saving)
    localStorage.setItem('customerName', name);
    localStorage.setItem('shippingAddress', shippingAddress);
    localStorage.setItem('contactNumber', contactNumber);

    setError('');
    alert('Order Confirmed!');
    navigate('/orders'); // Redirect to Order History
  };

  return (
    <div className="order-confirmation">
      <h2>Thank you for your purchase!</h2>
      <p>Please enter your shipping details to complete the order.</p>

      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-group">
        <label>Shipping Address:</label>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Enter full shipping address"
        />
      </div>

      <div className="form-group">
        <label>Contact Number:</label>
        <input
          type="text"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="Enter contact number"
        />
      </div>

      {error && <p className="error">{error}</p>}

      <button className="confirm-btn" onClick={handleConfirm}>
        Confirm & Finish
      </button>
    </div>
  );
};

export default OrderConfirmationPage;
