import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/api/admin/products?page=${page}&search=${query}&sort=${sortBy}`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, query, sortBy]);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (!confirm) return;

    try {
      const adminToken = localStorage.getItem('adminToken');
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete product.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Product List</h2>
        <Link to="/admin/products/create" className="px-4 py-2 bg-blue-600 text-white rounded">+ Add Product</Link>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="p-2 border rounded">
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
          <option value="stock_quantity">Stock</option>
        </select>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p._id}>
              <td className="p-2 border">{(page - 1) * 20 + i + 1}</td>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">₹{p.price}</td>
              <td className="p-2 border">{p.stock_quantity}</td>
              <td className="p-2 border">
                <Link to={`/admin/products/edit/${p._id}`} className="text-blue-600">Edit</Link> |{' '}
                <button className="text-red-600" onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 border ${page === i + 1 ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
