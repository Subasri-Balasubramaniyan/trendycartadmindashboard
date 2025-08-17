const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

const getAdminDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    const orders = await Order.find();

    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
    };

    orders.forEach((order) => {
      const status = order.status?.toLowerCase() || 'pending';
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      }
    });

    res.json({
      totalProducts,
      totalCustomers,
      orders: statusCounts,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getAdminDashboardStats };
