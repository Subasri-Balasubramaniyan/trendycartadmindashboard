// @desc    Upload product images
// @route   POST /api/products/upload-images
// @access  Private/Admin
export const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    // Get file paths
    const imagePaths = req.files.map(file => `/images/products/${file.filename}`);

    res.status(201).json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      data: imagePaths
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading images',
      error: error.message
    });
  }
};

export default uploadProductImages;
