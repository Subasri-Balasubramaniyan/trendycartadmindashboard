// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaUserCircle,
  FaSignOutAlt,
  FaShoppingCart,
} from 'react-icons/fa';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const customerToken = localStorage.getItem('token');
  const customerUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Only show logged in state if it's a customer token
  const isCustomerLoggedIn = customerToken && customerUser.role === 'customer';

  useEffect(() => {
    // Update cart count when component mounts and when localStorage changes
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartItemCount(totalItems);
    };

    updateCartCount();

    // Listen for storage changes (when items are added to cart)
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        updateCartCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom cart update events
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="brand">Trendy Cart</div>
      <ul className="nav-links">
        {isCustomerLoggedIn ? (
          // Logged in customer navigation
          <>
            <li><Link to="/products"><FaHome /> Home</Link></li>
            <li>
              <Link to="/cart" className="cart-link">
                <FaShoppingCart /> Cart
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Link>
            </li>
            <li><Link to="/profile"><FaUserCircle /> Profile</Link></li>
            <li><Link to="/about"><FaInfoCircle /> About</Link></li>
            <li><Link to="/contact"><FaPhone /> Contact</Link></li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt /> Logout ({customerUser.first_name || 'User'})
              </button>
            </li>
          </>
        ) : (
          // Not logged in navigation
          <>
            <li><Link to="/"><FaHome /> Home</Link></li>
            <li><Link to="/about"><FaInfoCircle /> About</Link></li>
            <li><Link to="/contact"><FaPhone /> Contact</Link></li>
            <li><Link to="/signup"><FaUserCircle /> Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Header;
