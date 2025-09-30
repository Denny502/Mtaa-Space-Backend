exports.validateProperty = (req, res, next) => {
  const { title, description, price, location, bedrooms, bathrooms, area } = req.body;
  
  if (!title || !description || !price || !location || !bedrooms || !bathrooms || !area) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }
  
  next();
};