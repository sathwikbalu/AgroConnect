import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['equipment', 'tool', 'other'],
    required: true
  },
  availability: {
    type: String,
    enum: ['available', 'in_use', 'maintenance'],
    default: 'available'
  },
  pricePerDay: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Resource', resourceSchema);