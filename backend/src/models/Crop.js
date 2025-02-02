import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function (v) {
        return (
          v.length === 2 &&
          v[0] >= -180 &&
          v[0] <= 180 && // longitude
          v[1] >= -90 &&
          v[1] <= 90
        ); // latitude
      },
      message: "Invalid coordinates",
    },
  },
});

const cropSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: locationSchema,
    required: true,
    index: "2dsphere", // Enable geospatial queries
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["available", "sold", "reserved"],
    default: "available",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes
cropSchema.index({ price: 1 });
cropSchema.index({ status: 1 });
cropSchema.index({ createdAt: -1 });

export default mongoose.model("Crop", cropSchema);
