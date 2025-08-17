import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const totalCost = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Validate shipping address
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      alert("Please fill in all shipping address fields");
      return;
    }

    setLoading(true);

    try {
      const customerToken = localStorage.getItem('token');
      
      if (!customerToken) {
        alert("Please log in to place an order");
        navigate('/login');
        return;
      }

      // Step 1: Ensure backend cart exists and is cleared
      try {
        await axios.delete('/cart/clear', {
          headers: {
            'Authorization': `Bearer ${customerToken}`
          }
        });
      } catch (clearError) {
        console.log('Clear cart note:', clearError.response?.data?.message || 'Cart cleared or created');
      }

      // Step 2: Add all localStorage cart items to backend cart
      for (const item of cart) {
        try {
          await axios.post('/cart/add', {
            productId: item._id,
            quantity: item.quantity,
            variant: item.variant || {}
          }, {
            headers: {
              'Authorization': `Bearer ${customerToken}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (addError) {
          console.error('Error adding item to cart:', addError);
          alert(`Failed to add ${item.name} to cart: ${addError.response?.data?.message || addError.message}`);
          return;
        }
      }

      // Step 3: Create order via API (will use backend cart)
      const orderData = {
        shippingAddress,
        paymentMethod,
        notes: "Order placed from website"
      };

      const response = await axios.post('/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${customerToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Clear localStorage cart after successful order
        localStorage.removeItem("cart");
        setCart([]);
        
        alert("Order placed successfully!");
        navigate("/profile?tab=orders");
      } else {
        alert("Failed to place order: " + response.data.message);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      if (error.response?.status === 401) {
        alert("Please log in again to place an order");
        navigate('/login');
      } else if (error.response?.status === 400) {
        alert("Order error: " + (error.response?.data?.message || "Invalid order data"));
      } else {
        alert("Failed to place order: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <h2>Your Checkout Cart is Empty 🛒</h2>
        <button onClick={() => navigate("/")}>Go Back to Shopping</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>🧾 Checkout</h2>
      
      {/* Cart Items */}
      <div className="checkout-section">
        <h3>Order Items</h3>
        <div className="checkout-items">
          {cart.map((item) => (
            <div key={item._id} className="checkout-item">
              <span>{item.name}</span>
              <span>Qty: {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <h3>Total: ₹{totalCost.toFixed(2)}</h3>
      </div>

      {/* Shipping Address Form */}
      <div className="checkout-section">
        <h3>Shipping Address</h3>
        <div className="address-form">
          <div className="form-row">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={shippingAddress.fullName}
              onChange={handleAddressChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={shippingAddress.phone}
              onChange={handleAddressChange}
              required
            />
          </div>
          <input
            type="text"
            name="addressLine1"
            placeholder="Address Line 1"
            value={shippingAddress.addressLine1}
            onChange={handleAddressChange}
            required
          />
          <input
            type="text"
            name="addressLine2"
            placeholder="Address Line 2 (Optional)"
            value={shippingAddress.addressLine2}
            onChange={handleAddressChange}
          />
          <div className="form-row">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={shippingAddress.city}
              onChange={handleAddressChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={shippingAddress.state}
              onChange={handleAddressChange}
              required
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={shippingAddress.postalCode}
              onChange={handleAddressChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="checkout-section">
        <h3>Payment Method</h3>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Cash on Delivery"
              checked={paymentMethod === 'Cash on Delivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="UPI"
              checked={paymentMethod === 'UPI'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            UPI Payment
          </label>
        </div>
      </div>

      <button 
        className="place-order-btn" 
        onClick={placeOrder}
        disabled={loading}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default CheckoutPage;
