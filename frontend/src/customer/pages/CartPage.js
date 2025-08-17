import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen } from "react-icons/fa";
import "./CartPage.css";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateLocalStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const handleRemove = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    updateLocalStorage(updatedCart);
  };

  const updateQuantity = (productId, delta) => {
    const updatedCart = cart.map((item) => {
      if (item._id === productId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    updateLocalStorage(updatedCart);
  };

  const totalCost = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="top-right-button">
          <button className="orders-btn" onClick={() => navigate("/orders")}>
            <FaBoxOpen style={{ marginRight: "8px" }} />
            My Orders
          </button>
        </div>
        <h2>Your Cart is Empty 🛒</h2>
        <button className="action-btn" onClick={() => navigate("/products")}>
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="top-right-button">
        <button className="orders-btn" onClick={() => navigate("/orders")}>
          <FaBoxOpen style={{ marginRight: "8px" }} />
          My Orders
        </button>
      </div>

      <h2>🛒 Your Cart</h2>

      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item._id}>
            <img src={item.image} alt={item.name} />
            <div className="item-info">
              <h4>{item.name}</h4>
              <p>Price: ₹{item.price}</p>

              <div className="quantity-controls">
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item._id, -1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item._id, 1)}
                >
                  +
                </button>
              </div>

              <p>Total: ₹{item.price * item.quantity}</p>
              <button
                className="remove-btn"
                onClick={() => handleRemove(item._id)}
              >
                ❌ Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total Cost: ₹{totalCost.toFixed(2)}</h3>
        <button
          className="checkout-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
