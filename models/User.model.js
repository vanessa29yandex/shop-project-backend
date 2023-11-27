const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  user_name: {
    required: true,
    type: String,
    unique: true,
  },
  user_email: {
    required: true,
    type: String,
    lowercase: true,
  },
  user_password: {
    required: true,
    type: String,
  },
  user_phone: {
    type: String,
    match: /^[0]\d{1,3}[-]?\d{7,10}$/,
  },
  user_address: {
    city: {
      type: String,
      trim: true,
    },
    street: {
      type: String,
      trim: true,
    },
    building: {
      type: String,
      trim: true,
    },
    apartment: {
      type: String,
      trim: true,
    },
  },
  user_cart: { 
    type: mongoose.Types.ObjectId,
    ref: "carts",
  },
  user_orders: [
    {
      order: {
        type: mongoose.Types.ObjectId,
        ref: "orders",
      },
    },
  ],
  user_avatar: {
    type: String,
  },
  token: {type: Object},

  email_verify_token:{type: String,},
});

userSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.user_password, 10);
  this.user_password = hash;
  next();
});

module.exports = mongoose.model("user", userSchema);
