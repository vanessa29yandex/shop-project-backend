const Cart = require('../models/Cart.model');
const Product = require('../models/Products.model')

// Get the user's cart by their user ID
const getCartByUserId = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you have a route parameter for the user ID
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'No cart found for the user',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully retrieved the user\'s cart',
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error in getting the user\'s cart',
      error: error.message,
    });
  }
};

// Add items to the user's cart
const addToCart = async (req, res) => {
  try {
    const cartId = req.params.cartId; // Assuming you have a route parameter for the user ID
    const { product, quantity } = req.body;
    const cart = await Cart.findById(cartId);

    // if (!cart) {
    //   // Create a new cart if it doesn't exist for the user
    //   const newCart = await Cart.create({
    //     user: userId,
    //     items: [{ product, quantity }],
    //   });
    //   return res.status(201).json({
    //     success: true,
    //     message: 'Successfully created the user\'s cart',
    //     data: newCart,
    //   });
    // } else {
      // Update the existing cart with the new item
      cart.items.push({ product, quantity });
      cart.updatedAt = new Date();
      await cart.save();

      return res.status(200).json({
        success: true,
        message: 'Successfully added items to the user\'s cart',
        data: cart,
      });
    // }
  } catch (error) {
    return res.status(500).json({
      message: 'Error in adding items to the user\'s cart',
      error: error.message,
    });
  }
};

// Update a cart item's quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you have a route parameter for the user ID
    const itemId = req.params.itemId; // Assuming you have a route parameter for the item ID
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'No cart found for the user',
      });
    }

    // Find and update the item's quantity
    const item = cart.items.id(itemId);
    if (item) {
      item.quantity = quantity;
      cart.updatedAt = new Date();
      await cart.save();

      return res.status(200).json({
        success: true,
        message: 'Successfully updated the cart item',
        data: cart,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'No item found in the cart with the given ID',
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error in updating the cart item',
      error: error.message,
    });
  }
};

// Remove items from the user's cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you have a route parameter for the user ID
    const itemId = req.params.itemId; // Assuming you have a route parameter for the item ID

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'No cart found for the user',
      });
    }

    // Find and remove the item from the cart
    const item = cart.items.id(itemId);
    if (item) {
      item.remove();
      cart.updatedAt = new Date();
      await cart.save();

      return res.status(200).json({
        success: true,
        message: 'Successfully removed the item from the cart',
        data: cart,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'No item found in the cart with the given ID',
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error in removing items from the user\'s cart',
      error: error.message,
    });
  }
};

module.exports = {
  getCartByUserId,
  addToCart,
  updateCartItem,
  removeFromCart,
};
