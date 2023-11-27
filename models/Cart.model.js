const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    // user: { 
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'user',
    //     required: true, // Assuming a user must be associated with the cart
    // },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true,
            },
            quantity: {
                type: Number,
                default: 1, // Default to 1 item
                min: 1, // Ensure quantity is at least 1
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('cart', cartSchema);
