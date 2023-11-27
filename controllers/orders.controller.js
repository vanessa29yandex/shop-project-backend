const Order = require('../models/Order.model');
const mongoose = require('mongoose');

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user items.product');
    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved all orders',
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error in getting all orders',
      error: error.message,
    });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  const { user, items, totalAmount } = req.body;

  try {
    const newOrder = await Order.create({
      user,
      items,
      totalAmount,
    });

    if (!newOrder) {
      return res.status(400).json({
        message: 'Could not create a new order',
      });
    }

    return res.status(201).json({
      message: 'Created order successfully',
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error in creating a new order',
      error: error.message,
    });
  }
};

// Get an order by ID
const getOrderById = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId).populate('user items.product');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No order found with the given ID',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully found the order',
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error in getting the order',
      error: error.message,
    });
  }
};

// Update an order by ID
const updateOrder = async (req, res) => {
  const orderId = req.params.orderId;
  const updateData = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'No order found with the given ID',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully updated the order',
      data: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error in updating the order',
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
};
