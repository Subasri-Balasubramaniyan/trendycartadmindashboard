import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios.js";
import "./OrderHistoryPage.css";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const parsed = new Date(dateString);
    const date = isNaN(parsed) ? new Date() : parsed;

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "status pending";
      case "processing":
        return "status processing";
      case "shipped":
        return "status shipped";
      case "delivered":
        return "status delivered";
      case "cancelled":
        return "status cancelled";
      default:
        return "status";
    }
  };

  const handleTrackOrder = (orderId) => {
    navigate(`/track-order/${orderId}`);
  };

  if (loading) return <div className="loading-message">Loading your orders...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="order-history">
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders placed yet.</p>
          <button onClick={() => navigate('/products')} className="shop-now-btn">
            Start Shopping
          </button>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total (₹)</th>
              <th>Status</th>
              <th>Track</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-8).toUpperCase()}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  {order.orderItems?.slice(0, 2).map(item => item.name).join(", ")}
                  {order.orderItems?.length > 2 && ` +${order.orderItems.length - 2} more`}
                </td>
                <td>₹{order.totalPrice?.toFixed(2)}</td>
                <td className={getStatusClass(order.orderStatus)}>{order.orderStatus}</td>
                <td>
                  <button
                    className="track-btn"
                    onClick={() => handleTrackOrder(order._id)}
                  >
                    Track Order
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistoryPage;
