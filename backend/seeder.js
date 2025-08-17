import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const sampleProducts = [
  {
    name: 'Men T-Shirt',
    description: 'Comfortable cotton t-shirt',
    price: 499,
    countInStock: 20,
    category: 'Men',
    subcategory: 'T-Shirts',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Women Kurti',
    description: 'Elegant embroidered kurti',
    price: 899,
    countInStock: 15,
    category: 'Women',
    subcategory: 'Kurtis',
    image: 'https://via.placeholder.com/150',
  },
];

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedProducts();
