const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager.model.js');

module.exports = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const managerToken = req.headers.authorization.split(' ')[1];

    try {
      const payload = jwt.verify(managerToken, process.env.JWT_SECRET);
      const manager = await Manager.findById(payload._id);

      if (!manager) {
        return res.json({ success: false, message: 'unauthorized access!' });
      }

      req.manager._id = payload._id;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.json({ success: false, message: 'unauthorized access!' });
      }
      if (error.name === 'TokenExpiredError') {
        return res.json({
          success: false,
          message: 'session expired try sign in!',
        });
      }

      res.res.json({ success: false, message: 'Internal server error!' });
    }
  } else {
    res.json({ success: false, message: 'unauthorized access!' });
  }
};