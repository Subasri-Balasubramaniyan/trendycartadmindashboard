// models/Setting.js
const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  logoUrl: { type: String, default: '' },
  primaryColor: { type: String, default: '#000000' },
  secondaryColor: { type: String, default: '#ffffff' },
  fontFamily: { type: String, default: 'Arial, sans-serif' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
