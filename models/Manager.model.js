const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const managerSchema = new mongoose.Schema({
    manager_name: {
        type: String,
        required: true,
        trim: true,
    },
    manager_email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    manager_password: {
        type: String,
        required: true,
    },
    user_phone: {
        type: String,
        match: /^[0]\d{1,3}[-]?\d{7,10}$/,
      },
    manager_role: {
        type: String,
        enum: ['admin', 'manager', 'employee'],
        default: 'employee',
    },

    token: {
        type: String,
    },
});

managerSchema.pre("save", async function (next) {
    const hash = await bcrypt.hash(this.manager_password, 10);
    this.manager_password = hash;
    next();
  });

module.exports = mongoose.model('manager', managerSchema);
