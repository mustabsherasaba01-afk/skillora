const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, trim: true },
  skills: { type: [String], default: [] },
  budget: { type: Number, required: true, min: 0 },
  deadline: { type: Date, required: true },
  experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'expert'], default: 'intermediate' },
  projectType: { type: String, enum: ['fixed', 'hourly'], default: 'fixed' },
  attachments: { type: [String], default: [] },
  status: { type: String, enum: ['open', 'in-progress', 'completed', 'cancelled'], default: 'open' },
  proposalsCount: { type: Number, default: 0 },
  hiredFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: { createdAt: true, updatedAt: true } });

module.exports = mongoose.model('Project', projectSchema);
