// controllers/adminController.js
import User from '../models/User.js';
import Product from '../models/Product.js';
import { Order } from '../models/Order.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Get real counts from database
    const [
      totalProducts,
      totalCustomers,
      totalOrders,
      deliveredOrders,
      shippedOrders,
      processingOrders
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'shipped' }),
      Order.countDocuments({ status: 'processing' })
    ]);

    const stats = {
      totalProducts,
      totalCustomers,
      totalOrders,
      deliveredOrders,
      shippedOrders,
      processingOrders,
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error("Error in getDashboardStats:", err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching dashboard stats' 
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    console.error("Error in getAllUsers:", err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching users' 
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'first_name last_name email')
      .populate('orderItems.product', 'name price images')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data: orders
    });
  } catch (err) {
    console.error("Error in getAllOrders:", err);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching orders' 
    });
  }
};
