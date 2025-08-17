import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./EditOrderPage.css";

const EditOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5005/api/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });

        if (response.data.success) {
          const orderData = response.data.data;
          setOrder({
            ...orderData,
            customerName: orderData.user?.first_name + " " + orderData.user?.last_name || "Guest Customer",
            items: orderData.orderItems.map(item => item.name).join(", "),
            total: orderData.totalPrice,
            status: orderData.orderStatus
          });
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        alert("❌ Error fetching order details");
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await axios.patch(`http://localhost:5005/api/orders/${id}/status`, {
        status: order.status,
        note: `Order updated by admin`
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        alert("✅ Order status updated successfully!");
        navigate("/admin/orders");
      } else {
        alert("❌ Failed to update order");
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert("❌ Error updating order: " + (error.response?.data?.message || error.message));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-order-container">
      <h2>Edit Order</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={order.customerName}
          onChange={handleChange}
          disabled
        />
        <input
          type="text"
          name="items"
          placeholder="Items (comma-separated)"
          value={order.items}
          onChange={handleChange}
          disabled
        />
        <input
          type="number"
          name="total"
          placeholder="Total Amount"
          value={order.total}
          onChange={handleChange}
          disabled
        />
        <select name="status" value={order.status} onChange={handleChange}>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button type="submit" disabled={updating}>
          {updating ? "Updating..." : "💾 Update Status"}
        </button>
      </form>
    </div>
  );
};

export default EditOrderPage;
