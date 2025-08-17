// validators/orderValidators.js
import { body } from 'express-validator';

export const orderValidator = [
  body('products')
    .isArray({ min: 1 })
    .withMessage('At least one product must be included in the order'),

  body('products.*.product')
    .notEmpty()
    .withMessage('Product ID is required'),

  body('products.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),

  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),

  body('shippingAddress.fullName')
    .notEmpty()
    .withMessage('Full name is required'),

  body('shippingAddress.phone')
    .notEmpty()
    .withMessage('Phone number is required'),

  body('shippingAddress.addressLine')
    .notEmpty()
    .withMessage('Address line is required'),

  body('shippingAddress.city')
    .notEmpty()
    .withMessage('City is required'),

  body('shippingAddress.pincode')
    .notEmpty()
    .withMessage('Pincode is required'),

  body('shippingAddress.state')
    .notEmpty()
    .withMessage('State is required'),

  body('shippingAddress.country')
    .notEmpty()
    .withMessage('Country is required'),
];
