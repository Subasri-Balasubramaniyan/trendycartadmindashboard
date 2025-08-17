// controllers/settingController.js
const Setting = require('../models/Setting');

// @desc Get branding settings
// @route GET /api/admin/settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    if (!settings) return res.status(404).json({ message: 'Settings not found' });
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Update branding settings
// @route PUT /api/admin/settings
exports.updateSettings = async (req, res) => {
  try {
    const { logoUrl, primaryColor, secondaryColor, fontFamily } = req.body;

    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting({ logoUrl, primaryColor, secondaryColor, fontFamily });
    } else {
      settings.logoUrl = logoUrl ?? settings.logoUrl;
      settings.primaryColor = primaryColor ?? settings.primaryColor;
      settings.secondaryColor = secondaryColor ?? settings.secondaryColor;
      settings.fontFamily = fontFamily ?? settings.fontFamily;
    }

    await settings.save();
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error('Error updating settings:', error.message);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};
