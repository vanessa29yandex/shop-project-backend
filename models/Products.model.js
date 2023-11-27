const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_description: {
        type: String,
        required: true,
    },
    product_price: {
        type: Number,
        required: true,
        min: [1, 'Must be from 1 and above']
    },
    product_stock: {
        type: Number,
    },
    product_image: {
        type: String,
    },
    categories:[{
        category:{
            type : mongoose.Types.ObjectId,
            ref: 'categories'
        }
    }],

    // Timestamps for creation and last update
    product_createdAt: {
        type: Date,
        default: Date.now,
    },
    product_updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('product', productSchema);
