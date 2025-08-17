// backend/models/Branding.js
import mongoose from 'mongoose';

const brandingSchema = new mongoose.Schema({
  logoUrl: { type: String },
  primaryColor: { type: String },
  secondaryColor: { type: String },
  tagline: { type: String },
}, { timestamps: true });

const Branding = mongoose.model('Branding', brandingSchema);

export default Branding;
