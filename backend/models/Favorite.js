const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });
favoriteSchema.index({ user: 1, project: 1 }, { unique: true, sparse: true });
favoriteSchema.index({ user: 1, freelancer: 1 }, { unique: true, sparse: true });
module.exports = mongoose.model('Favorite', favoriteSchema);
