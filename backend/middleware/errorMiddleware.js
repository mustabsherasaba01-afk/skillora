const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: Object.values(err.errors).map((item) => item.message).join(', ') });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: `Duplicate value for ${Object.keys(err.keyPattern).join(', ')}` });
  }
  return res.status(statusCode).json({ success: false, message: err.message || 'Something went wrong' });
};

module.exports = { notFound, errorHandler };
