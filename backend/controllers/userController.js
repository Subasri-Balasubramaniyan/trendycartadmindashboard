// controllers/userController.js
import User from '../models/User.js'; // ✅ default import

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.first_name = req.body.first_name || user.first_name;
    user.last_name = req.body.last_name || user.last_name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all customers (Admin only)
// @route   GET /api/users/admin/customers
// @access  Private/Admin
export const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    
    // Build search query for customers only (exclude admin users)
    const query = { role: { $ne: 'admin' } };
    
    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: 'i' } },
        { last_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    console.log(`[ADMIN_CUSTOMERS] Admin: ${req.user.email} retrieved ${customers.length} customers (total: ${total})`);

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get All Customers Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching customers',
      error: error.message 
    });
  }
};

// @desc    Delete customer (Admin only)
// @route   DELETE /api/users/admin/customers/:id
// @access  Private/Admin
export const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Customer not found' 
      });
    }

    // Prevent deletion of admin users
    if (customer.role === 'admin') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot delete admin users' 
      });
    }

    await User.findByIdAndDelete(customerId);
    
    console.log(`[ADMIN_DELETE_CUSTOMER] Admin: ${req.user.email} deleted customer: ${customer.email}`);

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Delete Customer Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting customer',
      error: error.message 
    });
  }
};
