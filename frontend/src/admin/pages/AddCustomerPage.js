// src/admin/pages/AddCustomerPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCustomerPage.css";

const AddCustomerPage = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem("customers")) || [];
    const newCustomer = { ...customer, id: Date.now() };
    localStorage.setItem("customers", JSON.stringify([...existing, newCustomer]));
    navigate("/admin/customers");
  };

  useEffect(() => {
    const form = document.querySelector(".add-customer-container");
    form.classList.add("fade-in");
  }, []);

  return (
    <div className="add-customer-container">
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit} className="customer-form">
        <div className="input-group">
          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={handleChange}
            required
          />
          <label>Customer Name</label>
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            required
          />
          <label>Email</label>
        </div>

        <div className="input-group">
          <input
            type="text"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
            required
          />
          <label>Phone Number</label>
        </div>

        <div className="input-group">
          <textarea
            name="address"
            value={customer.address}
            onChange={handleChange}
            required
          />
          <label>Address</label>
        </div>

       <div className="form-buttons">
  <button className="save-btn">Add Customer</button>
  <button className="cancel-btn">Cancel</button>
</div>

      </form>
    </div>
  );
};

export default AddCustomerPage;
