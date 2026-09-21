const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['client', 'freelancer'], required: true },
  profileImage: String,
  bio: String,
  title: String,
  location: String,
  skills: { type: [String], default: [] },
  hourlyRate: { type: Number, min: 0, default: 0 },
  experience: { type: String, default: 'beginner' },
  portfolio: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, default: 0 },
  completedProjects: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  isOnline: { type: Boolean, default: false }
}, { timestamps: { createdAt: true, updatedAt: false } });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
