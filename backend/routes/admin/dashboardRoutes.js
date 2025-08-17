const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const getAdminDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const pending = await Order.countDocuments({ status: 'Pending' });
    const processing = await Order.countDocuments({ status: 'Processing' });
    const shipped = await Order.countDocuments({ status: 'Shipped' });

    res.json({
      totalProducts,
      totalCustomers,
      orders: {
        pending,
        processing,
        shipped,
      },
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

module.exports = { getAdminDashboardStats };
