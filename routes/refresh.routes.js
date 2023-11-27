const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')

router.get('/', async (req,res) => {
  const cookies = req.cookies;

  if (!cookies.token) return res.sendStatus(401)

  const refreshToken = cookies.token
  try {
    const user = await User.findOne({token: refreshToken})
    console.log(user)
    if (!user) return res.sendStatus(403)

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET
    )

    if (!decoded) return res.sendStatus(403)
    
    let payload = {
      _id: user._id,
    };

    const customerToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 60,
    });
    
    res.send({ customerToken,
      user
    });
  } catch (error) {
    next (error)
  }
});

module.exports = router;