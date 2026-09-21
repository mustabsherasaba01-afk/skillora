const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  communication: { type: Number, min: 1, max: 5 },
  quality: { type: Number, min: 1, max: 5 },
  timeliness: { type: Number, min: 1, max: 5 },
  comment: { type: String, trim: true }
}, { timestamps: { createdAt: true, updatedAt: true } });
reviewSchema.index({ project: 1, reviewer: 1, reviewee: 1 }, { unique: true });
module.exports = mongoose.model('Review', reviewSchema);
