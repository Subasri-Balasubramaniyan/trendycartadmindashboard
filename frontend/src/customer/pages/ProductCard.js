import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const itemIndex = existingCart.findIndex((item) => item._id === product._id);
    if (itemIndex !== -1) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    // Trigger cart update event for header
    window.dispatchEvent(new Event('cartUpdated'));
    
    alert("Product added to cart!");
  };

  return (
    <div className="product-card">
      <img
        src={product.images?.[0] ? `http://localhost:5005${product.images[0]}` : "/images/default.jpg"}
        alt={product.name}
        className="product-image"
      />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₹{product.price}</p>
      <p
        className={`product-stock ${
          product.stock > 0 ? "in-stock" : "out-of-stock"
        }`}
      >
        {product.stock > 0 ? "In Stock" : "Out of Stock"}
      </p>
      <button
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
