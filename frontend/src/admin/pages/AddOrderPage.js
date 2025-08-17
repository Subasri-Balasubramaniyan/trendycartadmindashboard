import React from "react";
import { useNavigate } from "react-router-dom";
import "./AddOrderPage.css";

const AddOrderPage = () => {
  const navigate = useNavigate();

  return (
    <div className="add-order-container">
      <h2>Order Management</h2>
      <div className="info-message">
        <h3>📋 Information</h3>
        <p>
          Admins cannot create orders directly. Orders are created by customers when they 
          make purchases through the website.
        </p>
        <p>
          All customer orders will appear automatically in the Order Management section 
          once customers complete their purchases.
        </p>
        <div className="action-buttons">
          <button 
            className="btn btn-primary" 
            onClick={() => navigate("/admin/orders")}
          >
            📊 View All Orders
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => navigate("/admin/customers")}
          >
            👥 Manage Customers
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOrderPage;