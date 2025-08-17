// AddProductPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaUpload, FaImage } from 'react-icons/fa';
import axios from "../../api/axios.js";
import './AddProductPage.css';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create preview URLs for the selected files
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('price', parseFloat(product.price));
      formData.append('description', product.description);
      formData.append('category', product.category);
      formData.append('stock', parseInt(product.stock));
      
      // Append each file to the formData
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post('/products', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert('✅ Product added successfully!');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('❌ Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-box">
        <h2><FaPlusCircle style={{ marginRight: '8px' }} />Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name" 
            placeholder="Product Name" 
            value={product.name} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <input 
            type="number" 
            name="price" 
            placeholder="Price (₹)" 
            value={product.price} 
            onChange={handleChange} 
            step="0.01"
            required 
            disabled={loading}
          />
          <textarea 
            name="description" 
            placeholder="Description" 
            value={product.description} 
            onChange={handleChange} 
            rows="4" 
            required 
            disabled={loading}
          />
          
          <select 
            name="category" 
            value={product.category} 
            onChange={handleChange} 
            required
            disabled={loading}
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
            disabled={loading}
          />

          <div className="file-upload-container">
            <label className="file-upload-label">
              <FaImage className="upload-icon" /> Product Images
              <input 
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={loading}
                className="file-input"
              />
            </label>
            <span className="file-info">
              {selectedFiles.length > 0 
                ? `${selectedFiles.length} image(s) selected` 
                : 'No images selected'}
            </span>
          </div>

          {previewUrls.length > 0 && (
            <div className="image-preview-container">
              {previewUrls.map((url, index) => (
                <div key={index} className="image-preview">
                  <img src={url} alt={`Preview ${index + 1}`} />
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '⏳ Adding...' : '➕ Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
