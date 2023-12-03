const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true, // Reference to the user who placed the order
    },
    customer_details: {
        customer_name: {
          type: String,
          required: true,
        },
    
        customer_email: {
          type: String,
          required: true,
        },
    
        customer_phone: {
          type: String,
          required: true,
        },
    
        customer_address: {
          city: { type: String, trim: true, required: true },
          street: { type: String, trim: true, required: true },
          building: { type: String, trim: true, required: true },
          apartment: { type: String, trim: true, required: true },
        },
      },
    
      total_price: { type: Number, min: 1 },
    
      payment_details: {
        terminal_number: { type: String, required: true, match: /^[0-9]+$/ },
    
        transaction_number: {
          type: String,
          required: true,
          match: /^[0-9A-Za-z]+$/,
          unique: true,
        },
    
        last_digits: {
          type: String,
          required: true,
          match: /^[0-9]+$/,
        },
    
        transaction_date: {
          type: Date,
          default: function () {
            return Date.now();
          },
        },
      },
      
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true,
            },
            RTP: {
                type: Number,
                required: true,
                min: 1,
              },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
        }
    ],
    order_status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'canceled'],
        default: 'pending',
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});
orderSchema.pre('save', function (next) {
    this.total_price = this.products.reduce(
      (total, product) => total + product.RTP * product.quantity,
      0,
    );
  
    next()
  });
  
  orderSchema.post('save', (next) => {
    console.log('Order Saved!')
  })  

module.exports = mongoose.model('order', orderSchema);
