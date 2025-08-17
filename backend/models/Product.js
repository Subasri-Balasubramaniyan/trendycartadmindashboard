// models/Product.js
import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema({
  size: { type: String },
  color: { type: String },
  stock: { type: Number, default: 0 },
  price: { type: Number },
  sku: { type: String, unique: true, sparse: true }
});

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    index: true
  },
  description: { 
    type: String, 
    required: true 
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: String,
    required: true,
    index: true
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  sku: {
    type: String,
    unique: true,
    required: true
  },
  stock: { 
    type: Number, 
    default: 0,
    min: 0
  },
  images: [{ 
    type: String,
    required: true
  }],
  variants: [productVariantSchema],
  tags: [{
    type: String,
    trim: true
  }],
  features: [{
    name: String,
    value: String
  }],
  specifications: [{
    name: String,
    value: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
  weight: {
    type: Number // in grams
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  seoTitle: String,
  seoDescription: String,
  metaKeywords: [String]
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ soldCount: -1 });
productSchema.index({ createdAt: -1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
