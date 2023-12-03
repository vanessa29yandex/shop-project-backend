const Order = require('../models/Order.model');
const mongoose = require('mongoose');

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user products.product');
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
  try {
    const { userId: user, customer_details, payment_details, products } = req.body;

    const order = await Order.create({
      user,
      customer_details,
      payment_details,
      products,
    });
    // mail user

    const mailContent = `
    <html>
      <body>
        ....
      </body>
    </html>`;

    return res.status(200).send({
      success: true, message: 'Succeeded in creating order for the user', order_number: order.order_number
    })
  } catch (error) {
    next(error)
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
