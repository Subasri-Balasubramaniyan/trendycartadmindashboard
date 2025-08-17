import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerManagementPage.css";

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async (search = "") => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5005/api/users/admin/customers', {
        params: { search },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.data.success) {
        setCustomers(response.data.data);
      } else {
        console.error('Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('❌ Error fetching customers: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchCustomers(value);
    }, 500);
  };

  const handleDelete = async (customerId, customerName) => {
    if (window.confirm(`Are you sure you want to delete customer "${customerName}"?`)) {
      try {
        const response = await axios.delete(`http://localhost:5005/api/users/admin/customers/${customerId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });

        if (response.data.success) {
          alert('✅ Customer deleted successfully!');
          fetchCustomers(searchTerm); // Refresh the list
        } else {
          alert('❌ Failed to delete customer');
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('❌ Error deleting customer: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="customer-management-container">Loading customers...</div>;
  }

  return (
    <div className="customer-management-container">
      <h2 className="page-title">Customer Management</h2>
      
      <div className="customer-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <p className="customer-count">Total Customers: {customers.length}</p>
      </div>

      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table className="customer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined Date</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.first_name} {customer.last_name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone_number || 'N/A'}</td>
                <td>{formatDate(customer.createdAt)}</td>
                <td>
                  <span className={`role-badge ${customer.role}`}>
                    {customer.role}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(customer._id, `${customer.first_name} ${customer.last_name}`)}
                      title="Delete Customer"
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerManagementPage;
