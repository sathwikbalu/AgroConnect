import express from "express";
import { auth } from "../middleware/auth.js";
import Crop from "../models/Crop.js";
import User from "../models/User.js";

const router = express.Router();

// Get all crops with filters
router.get("/", auth, async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    let query = { status: "available" };

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const crops = await Crop.find(query)
      .populate("farmerId", "fullName email")
      .sort("-createdAt");

    res.json({
      success: true,
      crops: crops.map((crop) => ({
        id: crop._id,
        farmerId: crop.farmerId._id,
        farmerName: crop.farmerId.fullName,
        farmerEmail: crop.farmerId.email,
        name: crop.name,
        quantity: crop.quantity,
        unit: crop.unit,
        price: crop.price,
        location: {
          latitude: crop.location.coordinates[1],
          longitude: crop.location.coordinates[0],
        },
        description: crop.description,
        status: crop.status,
        createdAt: crop.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get crops error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching crops",
      error: error.message,
    });
  }
});

// Create new crop listing
router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "farmer") {
      return res.status(403).json({
        success: false,
        message: "Only farmers can create crop listings",
      });
    }

    const { name, quantity, unit, price, location, description } = req.body;

    // Create crop with properly formatted GeoJSON Point
    const crop = new Crop({
      farmerId: req.userId,
      name,
      quantity,
      unit,
      price,
      location: {
        type: "Point",
        coordinates: [Number(location.longitude), Number(location.latitude)], // MongoDB expects [longitude, latitude]
      },
      description,
      status: "available",
    });

    await crop.save();

    res.status(201).json({
      success: true,
      crop: {
        id: crop._id,
        farmerId: crop.farmerId,
        name: crop.name,
        quantity: crop.quantity,
        unit: crop.unit,
        price: crop.price,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        description: crop.description,
        status: crop.status,
        createdAt: crop.createdAt,
      },
    });
  } catch (error) {
    console.error("Create crop error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating crop listing",
      error: error.message,
    });
  }
});

// Update crop status
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    if (crop.farmerId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this crop",
      });
    }

    crop.status = status;
    await crop.save();

    res.json({
      success: true,
      crop: {
        id: crop._id,
        status: crop.status,
      },
    });
  } catch (error) {
    console.error("Update crop status error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating crop status",
      error: error.message,
    });
  }
});

export default router;
