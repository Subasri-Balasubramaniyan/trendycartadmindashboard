import React, { useEffect, useState } from "react";
import axios from "../../api/axios.js";
import "./OrderManagementPage.css";

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/orders/admin/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        // Remove from local state
        setOrders(orders.filter((order) => order._id !== id));
        alert("✅ Order deleted!");
      } catch (error) {
        console.error('Error deleting order:', error);
        alert("❌ Failed to delete order");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
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

  if (loading) return <div className="loading-message">Loading orders...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="order-management-container">
      <h2>Order Management</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-6)}</td>
                <td>{order.user?.first_name} {order.user?.last_name}</td>
                <td>
                  {order.orderItems?.slice(0, 2).map(item => item.name).join(", ")}
                  {order.orderItems?.length > 2 && ` +${order.orderItems.length - 2} more`}
                </td>
                <td>₹{order.totalPrice?.toFixed(2)}</td>
                <td>
                  <span className={getStatusClass(order.orderStatus)}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="delete-btn"
                  >
                    🗑️ Delete
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

export default OrderManagementPage;
