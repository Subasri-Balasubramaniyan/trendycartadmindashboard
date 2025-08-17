import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "../../api/axios.js";
import './AddProductPage.css';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.data.success) {
        const productData = response.data.data;
        setProduct({
          name: productData.name || '',
          price: productData.price || '',
          description: productData.description || '',
          category: productData.category?._id || productData.category || '',
          stock: productData.stock || '',
          images: productData.images || [],
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updateData = {
        name: product.name,
        price: parseFloat(product.price),
        description: product.description,
        category: product.category,
        stock: parseInt(product.stock),
      };

      const response = await axios.put(`/products/${id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        alert("✅ Product updated successfully!");
        navigate("/admin/products");
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert("❌ Failed to update product");
    }
  };

  if (loading) return <div className="loading-message">Loading product...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="add-product-container">
      <div className="add-product-box">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name" 
            placeholder="Product Name" 
            value={product.name} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="number" 
            name="price" 
            placeholder="Price (₹)" 
            value={product.price} 
            onChange={handleChange} 
            step="0.01"
            required 
          />
          <textarea 
            name="description" 
            placeholder="Description" 
            value={product.description} 
            onChange={handleChange} 
            rows="4" 
            required 
          />
          
          <select 
            name="category" 
            value={product.category} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <input 
            type="number" 
            name="stock" 
            placeholder="Stock Quantity" 
            value={product.stock} 
            onChange={handleChange} 
            min="0"
            required 
          />

          {product.images && product.images.length > 0 && (
            <div className="current-images">
              <p>Current Images:</p>
              <div className="image-previews">
                {product.images.map((img, index) => (
                  <img 
                    key={index}
                    src={`http://localhost:5005${img}`} 
                    alt={`Product ${index + 1}`}
                    className="edit-product-thumbnail"
                  />
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="submit-btn">💾 Update Product</button>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
