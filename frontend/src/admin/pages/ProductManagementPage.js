import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import axios from "../../api/axios.js";
import "./ProductManagementPage.css";

const ProductManagementPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/products/admin/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.data.success) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/products/${id}?hard=true`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        // Remove from local state
        setProducts(products.filter((product) => product._id !== id));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error('Error deleting product:', error);
        alert("Failed to delete product");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  return (
    <div className="product-management-container">
      <div className="header-row">
        <h2>Product Management</h2>
        <button
          className="add-product-button"
          onClick={() => navigate("/admin/products/add")}
        >
          <FaPlus className="icon" />
          Add Product
        </button>
      </div>

      {loading && <div className="loading-message">Loading products...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <table className="product-management-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>
                    {product.images && product.images[0] ? (
                      <img 
                        src={`http://localhost:5005${product.images[0]}`} 
                        alt={product.name}
                        className="product-thumbnail"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="no-image-placeholder" style={{display: product.images && product.images[0] ? 'none' : 'flex'}}>
                      <FaImage />
                    </div>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category?.name || product.category}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-button edit"
                        onClick={() => handleEdit(product._id)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDelete(product._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No products found. Add some!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductManagementPage;
