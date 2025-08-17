import React from "react";

const CustomerForm = ({ formData, setFormData, handleSubmit, isEdit }) => {
  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <input
        type="text"
        placeholder="Full Name"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="text"
        placeholder="Phone"
        required
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <button type="submit">{isEdit ? "Update" : "Add"} Customer</button>
    </form>
  );
};

export default CustomerForm;
