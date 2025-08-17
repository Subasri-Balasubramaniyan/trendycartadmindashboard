import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2" />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.description}</p>
      <p className="font-bold mt-1">₹{product.price}</p>
      <p className={product.inStock ? "text-green-600" : "text-red-500"}>
        {product.inStock ? "In Stock" : "Out of Stock"}
      </p>
      <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
