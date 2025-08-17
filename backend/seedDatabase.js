import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import products from './data/products.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Create categories
const createCategories = async () => {
  console.log('📦 Creating categories...');
  
  const categoriesData = [
    {
      name: 'Men',
      description: 'Clothing and accessories for men',
      subcategories: [
        { name: 'T-Shirts', description: 'Casual and formal t-shirts' },
        { name: 'Shirts', description: 'Formal and casual shirts' },
        { name: 'Pants', description: 'Jeans, chinos, and formal pants' }
      ]
    },
    {
      name: 'Women',
      description: 'Clothing and accessories for women',
      subcategories: [
        { name: 'Sarees', description: 'Traditional and modern sarees' },
        { name: 'Kurtis', description: 'Ethnic and casual kurtis' },
        { name: 'Jeans', description: 'Denim wear for women' }
      ]
    },
    {
      name: 'Kids',
      description: 'Clothing for children',
      subcategories: [
        { name: 'Traditional', description: 'Traditional wear for kids' },
        { name: 'Modern', description: 'Modern casual wear for kids' }
      ]
    }
  ];

  const createdCategories = {};
  
  for (const categoryData of categoriesData) {
    const existingCategory = await Category.findOne({ name: categoryData.name });
    
    if (!existingCategory) {
      const category = new Category(categoryData);
      await category.save();
      createdCategories[categoryData.name] = category._id;
      console.log(`✅ Created category: ${categoryData.name}`);
    } else {
      createdCategories[categoryData.name] = existingCategory._id;
      console.log(`🔄 Category already exists: ${categoryData.name}`);
    }
  }
  
  return createdCategories;
};

// Generate unique SKU
const generateSKU = (product, index) => {
  const categoryCode = product.category.substring(0, 3).toUpperCase();
  const subcategoryCode = product.subcategory ? 
    product.subcategory.substring(0, 3).toUpperCase() : 'GEN';
  const productCode = String(index + 1).padStart(3, '0');
  return `${categoryCode}-${subcategoryCode}-${productCode}`;
};

// Seed products
const seedProducts = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    
    // Create categories
    const categories = await createCategories();
    
    console.log('🌱 Seeding products...');
    
    const productsToInsert = products.map((product, index) => {
      // Get category ID
      const categoryId = categories[product.category];
      
      if (!categoryId) {
        console.warn(`⚠️  Category not found for product: ${product.name}`);
        return null;
      }

      return {
        name: product.name || `Product ${index + 1}`,
        description: product.description || 'High-quality product',
        shortDescription: product.description ? 
          product.description.substring(0, 100) : 'Premium quality item',
        price: product.price || 999,
        originalPrice: product.price ? Math.round(product.price * 1.2) : 1199,
        category: categoryId,
        subcategory: product.subcategory || 'General',
        brand: product.brand || 'TrendyCart',
        sku: generateSKU(product, index),
        stock: product.countInStock !== undefined ? product.countInStock : 10,
        images: product.image ? [product.image] : ['/images/default.jpg'],
        tags: [
          product.category?.toLowerCase(),
          product.subcategory?.toLowerCase()
        ].filter(Boolean),
        isActive: true,
        isFeatured: index < 12, // First 12 products are featured
        averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
        numReviews: Math.floor(Math.random() * 50) + 1,
        soldCount: Math.floor(Math.random() * 100),
        weight: Math.floor(Math.random() * 1000) + 100, // 100g to 1100g
        dimensions: {
          length: Math.floor(Math.random() * 50) + 10,
          width: Math.floor(Math.random() * 40) + 10,
          height: Math.floor(Math.random() * 10) + 2
        },
        seoTitle: `${product.name} - Buy Online at TrendyCart`,
        seoDescription: `Shop ${product.name} at best prices. ${product.description || 'Premium quality guaranteed.'}`
      };
    }).filter(Boolean);
    
    console.log(`📊 Inserting ${productsToInsert.length} products...`);
    
    // Insert products in batches
    const batchSize = 50;
    for (let i = 0; i < productsToInsert.length; i += batchSize) {
      const batch = productsToInsert.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(productsToInsert.length / batchSize)}`);
    }
    
    console.log('🎉 Products seeded successfully!');
    
    // Print summary
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    
    console.log(`\n📈 Seeding Summary:`);
    console.log(`   📦 Categories: ${totalCategories}`);
    console.log(`   🛍️  Products: ${totalProducts}`);
    console.log(`   ⭐ Featured: ${await Product.countDocuments({ isFeatured: true })}`);
    console.log(`   📦 In Stock: ${await Product.countDocuments({ stock: { $gt: 0 } })}`);
    console.log(`   💰 Average Price: ₹${Math.round(productsToInsert.reduce((sum, p) => sum + p.price, 0) / productsToInsert.length)}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder
if (process.argv[2] === 'seed') {
  seedProducts();
} else {
  console.log('Usage: npm run seed');
  console.log('This will clear all existing products and categories, then seed new data.');
}
