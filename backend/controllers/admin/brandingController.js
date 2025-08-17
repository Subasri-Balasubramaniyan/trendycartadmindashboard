import Branding from '../../models/Branding.js';

// Get current branding
export const getBranding = async (req, res) => {
  const branding = await Branding.findOne() || {};
  res.json(branding);
};

// Update branding
export const updateBranding = async (req, res) => {
  const { logoUrl, siteTitle, primaryColor } = req.body;

  let branding = await Branding.findOne();
  if (!branding) {
    branding = new Branding({ logoUrl, siteTitle, primaryColor });
  } else {
    branding.logoUrl = logoUrl;
    branding.siteTitle = siteTitle;
    branding.primaryColor = primaryColor;
  }

  await branding.save();
  res.json({ message: 'Branding updated', branding });
};
