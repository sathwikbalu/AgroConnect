import express from 'express';
import { auth } from '../middleware/auth.js';
import Resource from '../models/Resource.js';
import ResourceRequest from '../models/ResourceRequest.js';
import User from '../models/User.js';

const router = express.Router();

// Get all resources with filters
router.get('/', auth, async (req, res) => {
  try {
    const { type, availability, maxPrice } = req.query;
    let query = {};

    if (type) query.type = type;
    if (availability) query.availability = availability;
    if (maxPrice) query.pricePerDay = { $lte: Number(maxPrice) };

    const resources = await Resource.find(query)
      .populate('ownerId', 'fullName email')
      .sort('-createdAt');

    res.json({
      success: true,
      resources: resources.map(resource => ({
        id: resource._id,
        ownerId: resource.ownerId._id,
        ownerName: resource.ownerId.fullName,
        ownerEmail: resource.ownerId.email,
        name: resource.name,
        type: resource.type,
        availability: resource.availability,
        pricePerDay: resource.pricePerDay,
        description: resource.description,
        createdAt: resource.createdAt
      }))
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resources',
      error: error.message
    });
  }
});

// Get requests for owner's resources
router.get('/requests', auth, async (req, res) => {
  try {
    const requests = await ResourceRequest.find({ ownerId: req.userId })
      .populate('resourceId')
      .populate('requesterId', 'fullName email')
      .sort('-createdAt');

    res.json({
      success: true,
      requests: requests.map(request => ({
        id: request._id,
        resource: {
          id: request.resourceId._id,
          name: request.resourceId.name,
          type: request.resourceId.type,
          pricePerDay: request.resourceId.pricePerDay
        },
        requester: {
          id: request.requesterId._id,
          name: request.requesterId.fullName,
          email: request.requesterId.email
        },
        startDate: request.startDate,
        endDate: request.endDate,
        status: request.status,
        offerAmount: request.offerAmount,
        message: request.message,
        createdAt: request.createdAt
      }))
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching requests',
      error: error.message
    });
  }
});

// Create new resource listing
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'farmer') {
      return res.status(403).json({
        success: false,
        message: 'Only farmers can create resource listings'
      });
    }

    const resource = new Resource({
      ownerId: req.userId,
      ...req.body
    });

    await resource.save();

    res.status(201).json({
      success: true,
      resource: {
        id: resource._id,
        ownerId: resource.ownerId,
        name: resource.name,
        type: resource.type,
        availability: resource.availability,
        pricePerDay: resource.pricePerDay,
        description: resource.description,
        createdAt: resource.createdAt
      }
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating resource listing',
      error: error.message
    });
  }
});

// Request a resource
router.post('/:id/request', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    if (resource.availability !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Resource is not available'
      });
    }

    const { startDate, endDate, offerAmount, message } = req.body;

    const request = new ResourceRequest({
      resourceId: resource._id,
      requesterId: req.userId,
      ownerId: resource.ownerId,
      startDate,
      endDate,
      offerAmount,
      message
    });

    await request.save();

    res.status(201).json({
      success: true,
      request: {
        id: request._id,
        resourceId: request.resourceId,
        requesterId: request.requesterId,
        ownerId: request.ownerId,
        startDate: request.startDate,
        endDate: request.endDate,
        status: request.status,
        offerAmount: request.offerAmount,
        message: request.message,
        createdAt: request.createdAt
      }
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating request',
      error: error.message
    });
  }
});

// Respond to a request
router.patch('/requests/:id/respond', auth, async (req, res) => {
  try {
    const request = await ResourceRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.ownerId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this request'
      });
    }

    const { status } = req.body;
    request.status = status;

    if (status === 'accepted') {
      const resource = await Resource.findById(request.resourceId);
      if (resource) {
        resource.availability = 'in_use';
        await resource.save();
      }
    }

    await request.save();

    res.json({
      success: true,
      request: {
        id: request._id,
        status: request.status
      }
    });
  } catch (error) {
    console.error('Respond to request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error responding to request',
      error: error.message
    });
  }
});

export default router;