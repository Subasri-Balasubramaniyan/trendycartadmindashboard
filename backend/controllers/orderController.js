import { Order } from "../models/Order.js";
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      couponCode,
      isGift,
      giftMessage,
      notes
    } = req.body;

    // Validate required fields
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ 
        success: false,
        message: "Shipping address and payment method are required" 
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images stock soldCount isActive');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Cart is empty" 
      });
    }

    // Check stock availability for all items
    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) {
        return res.status(400).json({ 
          success: false,
          message: `Product ${item.name} is not available` 
        });
      }
      
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false,
          message: `Not enough stock for ${item.product.name}. Available: ${item.product.stock}` 
        });
      }
    }

    // Calculate prices
    const itemsPrice = cart.totalPrice;
    const shippingPrice = itemsPrice > 500 ? 0 : 50; // Free shipping above ₹500
    const taxRate = 0.18; // 18% GST
    const taxPrice = Math.round(itemsPrice * taxRate);
    
    let discount = { amount: 0, couponCode: null };

    // Apply coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ 
        code: couponCode.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
      });

      if (!coupon || !coupon.isValidCoupon()) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid or expired coupon" 
        });
      }

      if (itemsPrice < coupon.minimumOrderAmount) {
        return res.status(400).json({ 
          success: false,
          message: `Minimum order amount ₹${coupon.minimumOrderAmount} required for this coupon` 
        });
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discountType === 'percentage') {
        discountAmount = Math.round((itemsPrice * coupon.discountValue) / 100);
        if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
          discountAmount = coupon.maximumDiscount;
        }
      } else {
        discountAmount = coupon.discountValue;
      }

      discount = { amount: discountAmount, couponCode: coupon.code };

      // Update coupon usage
      coupon.usedCount += 1;
      await coupon.save();
    }

    const totalPrice = itemsPrice + shippingPrice + taxPrice - discount.amount;

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0],
      price: item.price,
      quantity: item.quantity,
      variant: item.variant || {}
    }));

    // Create order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      discount,
      isGift: isGift || false,
      giftMessage: isGift ? giftMessage : undefined,
      notes,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    const savedOrder = await order.save();

    // Update product stock and sold count
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { 
          stock: -item.quantity,
          soldCount: item.quantity 
        }
      });
    }

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    await savedOrder.populate('user', 'first_name last_name email');

    res.status(201).json({ 
      success: true,
      message: "Order placed successfully", 
      data: savedOrder 
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error while creating order", 
      error: error.message 
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalOrders = await Order.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching orders", 
      error: error.message 
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    })
    .populate('orderItems.product', 'name images description')
    .populate('user', 'first_name last_name email');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching order", 
      error: error.message 
    });
  }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Check if order can be cancelled
    if (!['Pending', 'Processing'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        success: false,
        message: 'Order cannot be cancelled at this stage' 
      });
    }

    // Update order status
    order.orderStatus = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      date: new Date(),
      note: 'Cancelled by customer'
    });

    await order.save();

    // Restore product stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 
          stock: item.quantity,
          soldCount: -item.quantity 
        }
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error while cancelling order", 
      error: error.message 
    });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Filter by status
    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) query.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) query.createdAt.$lte = new Date(req.query.endDate);
    }

    const orders = await Order.find(query)
      .populate('user', 'first_name last_name email')
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalOrders = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching orders", 
      error: error.message 
    });
  }
};

// @desc    Update order status (Admin only)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Update order status
    order.orderStatus = status;
    order.statusHistory.push({
      status,
      date: new Date(),
      note: note || `Status updated to ${status}`
    });

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (status === 'Delivered') {
      order.deliveryDate = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error while updating order status", 
      error: error.message 
    });
  }
};

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
export const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const stats = await Promise.all([
      // Total orders
      Order.countDocuments(),
      
      // Orders this month
      Order.countDocuments({
        createdAt: { $gte: lastMonth }
      }),
      
      // Total revenue
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      
      // Revenue this month
      Order.aggregate([
        { 
          $match: { 
            orderStatus: { $ne: 'Cancelled' },
            createdAt: { $gte: lastMonth }
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      
      // Orders by status
      Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
      ]),
      
      // Top selling products
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $unwind: '$orderItems' },
        { 
          $group: { 
            _id: '$orderItems.product', 
            totalSold: { $sum: '$orderItems.quantity' },
            revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
            productName: { $first: '$orderItems.name' }
          } 
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalOrders: stats[0],
        ordersThisMonth: stats[1],
        totalRevenue: stats[2][0]?.total || 0,
        revenueThisMonth: stats[3][0]?.total || 0,
        ordersByStatus: stats[4],
        topProducts: stats[5]
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error while fetching order statistics", 
      error: error.message 
    });
  }
};

// @desc    Delete order (Admin only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    console.log(`[DELETE ORDER] Order ID: ${req.params.id}`);
    console.log(`[DELETE ORDER] User: ${req.user?.email} (${req.user?.role})`);

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    console.log(`[DELETE ORDER] Found order: ${order._id} for user: ${order.user}`);

    // If order is not cancelled, restore product stock
    if (order.orderStatus !== 'Cancelled') {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { 
            stock: item.quantity,
            soldCount: -item.quantity 
          }
        });
      }
      console.log(`[DELETE ORDER] Restored stock for order items`);
    }

    // Delete the order
    await Order.findByIdAndDelete(req.params.id);
    console.log(`[DELETE ORDER] Order deleted successfully`);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting order',
      error: error.message 
    });
  }
};

// @desc    Create order manually (Admin only)
// @route   POST /api/orders/admin
// @access  Private/Admin
export const createOrderAdmin = async (req, res) => {
  try {
    const {
      customerName,
      items,
      total,
      status,
      shippingAddress,
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!customerName || !items || !total) {
      return res.status(400).json({ 
        success: false,
        message: "Customer name, items, and total are required" 
      });
    }

    // Create order items array with required fields
    const orderItems = items.map((item, index) => ({
      product: null, // Admin-created orders don't reference actual products
      name: typeof item === 'string' ? item : item.name || item,
      image: '/images/default-product.jpg', // Default image for admin-created items
      quantity: typeof item === 'object' && item.quantity ? item.quantity : 1,
      price: typeof item === 'object' && item.price ? item.price : (parseFloat(total) / items.length)
    }));

    const order = new Order({
      user: null, // Admin-created orders don't have a user
      orderItems,
      totalPrice: parseFloat(total),
      orderStatus: status || 'Processing',
      shippingAddress: shippingAddress || {
        fullName: customerName,
        address: 'Admin created order',
        city: 'N/A',
        state: 'N/A',
        postalCode: '00000',
        country: 'N/A'
      },
      paymentMethod: paymentMethod || 'Admin Created',
      paymentStatus: 'Paid',
      isPaid: true,
      paidAt: new Date(),
      createdBy: req.user._id,
      adminCreated: true,
      statusHistory: [{
        status: status || 'Processing',
        date: new Date(),
        note: `Order created by admin: ${req.user.email}`
      }]
    });

    const savedOrder = await order.save();
    
    console.log(`[ADMIN_CREATE_ORDER] Admin: ${req.user.email} created order for: ${customerName}`);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: savedOrder
    });
  } catch (error) {
    console.error('Admin create order error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error while creating order", 
      error: error.message 
    });
  }
};
