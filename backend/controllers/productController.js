import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';

// @desc    Get all products with filtering, pagination, and search
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query object
    let query = { isActive: true };
    
    // Filter by category
    if (req.query.category) {
      const category = await Category.findOne({ name: req.query.category });
      if (category) {
        query.category = category._id;
      }
    }
    
    // Filter by subcategory
    if (req.query.subcategory) {
      query.subcategory = req.query.subcategory;
    }
    
    // Filter by brand
    if (req.query.brand) {
      query.brand = req.query.brand;
    }
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Featured products
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }

    // Sort options
    let sortBy = {};
    switch (req.query.sort) {
      case 'price_low':
        sortBy.price = 1;
        break;
      case 'price_high':
        sortBy.price = -1;
        break;
      case 'newest':
        sortBy.createdAt = -1;
        break;
      case 'rating':
        sortBy.averageRating = -1;
        break;
      case 'popular':
        sortBy.soldCount = -1;
        break;
      default:
        sortBy.createdAt = -1;
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching products',
      error: error.message 
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description')
      .lean();

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Get reviews for this product
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'first_name last_name avatar')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get related products (same category, different product)
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true
    })
    .limit(6)
    .select('name price images averageRating')
    .lean();

    res.json({
      success: true,
      data: {
        product,
        reviews,
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching product',
      error: error.message 
    });
  }
};

// @desc    Add new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const addProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      shortDescription,
      price, 
      originalPrice,
      category, 
      subcategory,
      brand,
      sku,
      stock, 
      variants,
      tags,
      features,
      specifications,
      weight,
      dimensions,
      seoTitle,
      seoDescription,
      metaKeywords
    } = req.body;

    // Get uploaded file paths
    const images = req.files ? req.files.map(file => `/images/products/${file.filename}`) : [];

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields' 
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid category' 
      });
    }

    const newProduct = new Product({
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      category,
      subcategory: subcategory || 'General',
      brand: brand || 'Generic',
      sku: sku || `SKU-${Date.now()}`,
      stock,
      images,
      variants,
      tags,
      features,
      specifications,
      weight,
      dimensions,
      seoTitle,
      seoDescription,
      metaKeywords
    });

    const savedProduct = await newProduct.save();
    await savedProduct.populate('category', 'name');

    res.status(201).json({ 
      success: true,
      message: 'Product added successfully', 
      data: savedProduct 
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while adding product',
      error: error.message 
    });
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Get uploaded file paths if any
    const newImages = req.files ? req.files.map(file => `/images/products/${file.filename}`) : [];
    
    // If new images were uploaded, add them to existing images
    if (newImages.length > 0) {
      if (req.body.replaceImages === 'true') {
        req.body.images = newImages; // Replace existing images
      } else {
        req.body.images = [...product.images, ...newImages]; // Append to existing images
      }
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      product[key] = req.body[key];
    });

    const updatedProduct = await product.save();
    await updatedProduct.populate('category', 'name');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating product',
      error: error.message 
    });
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    console.log(`[DELETE] Product ID: ${req.params.id}`);
    console.log(`[DELETE] Hard delete query: ${req.query.hard}`);
    console.log(`[DELETE] User: ${req.user?.email} (${req.user?.role})`);

    const product = await Product.findById(req.params.id);

    if (!product) {
      console.log(`[DELETE] Product not found: ${req.params.id}`);
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    console.log(`[DELETE] Found product: ${product.name}`);

    // Check if we should perform a hard delete (completely remove from database)
    // or soft delete (just mark as inactive)
    const hardDelete = req.query.hard === 'true';
    console.log(`[DELETE] Hard delete: ${hardDelete}`);

    if (hardDelete) {
      // Hard delete - completely remove from database
      console.log(`[DELETE] Performing hard delete for product: ${product.name}`);
      await Product.findByIdAndDelete(req.params.id);
      console.log(`[DELETE] Hard delete successful`);
    } else {
      // Soft delete - just mark as inactive
      console.log(`[DELETE] Performing soft delete for product: ${product.name}`);
      product.isActive = false;
      await product.save();
      console.log(`[DELETE] Soft delete successful`);
    }

    res.json({
      success: true,
      message: `Product ${hardDelete ? 'permanently ' : ''}deleted successfully`
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting product',
      error: error.message 
    });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .select('name description image subcategories')
      .lean();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching categories',
      error: error.message 
    });
  }
};

// @desc    Get product brands
// @route   GET /api/products/brands
// @access  Public
export const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand', { isActive: true });
    
    res.json({
      success: true,
      data: brands
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching brands',
      error: error.message 
    });
  }
};

// @desc    Update product stock (Admin only)
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
export const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (stock < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Stock cannot be negative' 
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: { stock: product.stock }
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating stock',
      error: error.message 
    });
  }
};

// @desc    Get all products for admin (including inactive)
// @route   GET /api/products/admin/all
// @access  Private/Admin
export const getAllProductsAdmin = async (req, res) => {
  try {
    console.log(`[ADMIN_PRODUCTS] User: ${req.user?.email} (${req.user?.role})`);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Admin can see all products (active and inactive)
    let query = {};
    
    // Filter by category if specified
    if (req.query.category) {
      const category = await Category.findOne({ name: req.query.category });
      if (category) {
        query.category = category._id;
      }
    }
    
    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    console.log(`[ADMIN_PRODUCTS] Query:`, query);

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    console.log(`[ADMIN_PRODUCTS] Found ${products.length} products (total: ${totalProducts})`);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching admin products',
      error: error.message 
    });
  }
};
