const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`)
});

const allowedTypes = /jpeg|jpg|png|webp|pdf|doc|docx|zip/;
const fileFilter = (req, file, callback) => {
  const valid = allowedTypes.test(path.extname(file.originalname).toLowerCase()) && allowedTypes.test(file.mimetype);
  callback(valid ? null : new Error('Unsupported file type'), valid);
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: Number(process.env.UPLOAD_MAX_MB || 10) * 1024 * 1024 } });
