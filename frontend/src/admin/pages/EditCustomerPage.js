import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerForm from "../components/CustomerForm";

const EditCustomerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const customer = customers.find((c) => c._id === id);
    if (customer) setFormData(customer);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const updated = customers.map((c) =>
      c._id === id ? { ...c, ...formData } : c
    );
    localStorage.setItem("customers", JSON.stringify(updated));
    alert("✅ Customer updated!");
    navigate("/admin/customers");
  };

  return (
    <div className="customer-form-container">
      <h2>Edit Customer</h2>
      <CustomerForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isEdit={true}
      />
    </div>
  );
};

export default EditCustomerPage;
