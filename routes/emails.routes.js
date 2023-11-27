const router = require('express').Router();
const mailer = require('nodemailer');
const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// email configuration

const transporter = mailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'irina.tolshinsky@gmail.com',
    pass: process.env.MAILER_PASS,
  },
});

router.post('/test', (req, res, next) => {
  const user_email = 'irina.tolshinsky@gmail.com';
  const emailOptions = {
    to: user_email,
    subject: 'This is a test email',
    html: `<h1> Hello ${user_email} this is a test email, congratulations
    !</h1>`,
  };

  transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
      res.status(400).send({
        status: '400',
        success: false,
        message: "Couldn't send email!",
      });
    } else {
      console.log('Email Sent!', info.response);
      res.sendStatus(200);
    }
  });
});

router.post('/send-password-reset-link', async (req, res, next) => {
  const { user_email } = req.body;

  try {
    const user = await User.findOne({ user_email });

    if (!user) res.sendStatus(400);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '4m',
    });

    const updatedUserWithToken = await User.findByIdAndUpdate(
      { _id: user._id },
      { email_verify_token: token },
      { new: true },
    );

    if (updatedUserWithToken) {
      const emailOptions = {
        to: user_email,
        subject: 'Password reset link for Rehitim Shop',
        html: ` <h1> Hello ${updatedUserWithToken.user_name}!</h1>
                <p>Here is a link that is valid for 4 minutes to reset your password: 
                </p>,
                <a href="${process.env.CLIENT_URL}/forgot-password/${user._id}?token=${updatedUserWithToken.email_verify_token}">Reset Password</a>`,
      };

      transporter.sendMail(emailOptions, (error, info) => {
        if (error) {
          console.log('Error:', error);
          res.status(400).send({
            status: '400',
            success: false,
            message: "Couldn't send email!",
          });
        } else {
          console.log('Email Sent!', info.response);
          res
            .status(201)
            .send({ status: 201, message: 'Email was sent successfully' });
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/forgot-password/:id', async (req, res, next) => {
  const { id } = req.params;
  const { email_verify_token } = req.headers;

  try {
    const validUser = await User.findOne({ _id: id, email_verify_token });

    const verifyToken = jwt.verify(email_verify_token, process.env.JWT_SECRET);

    if (verifyToken && verifyToken._id) {
      res.status(201).send({
        status: 201,
        success: true,
        message: 'User verified',
        user: validUser,
      });
    } else {
      res
        .status(401)
        .send({ status: 401, success: false, message: 'User not verified' });
    }
  } catch (error) {
    res.status(401).send({
      status: 401,
      success: false,
      message: 'User not verified',
      error,
    });
  }
});

router.post('/update-password/:id', async (req, res, next) => {
  const { id } = req.params;
  const { user_password, email_verify_token } = req.body;

  try {
    const validUser = await User.findOne({
      _id: id,
      email_verify_token,
    });

    const verifyToken = jwt.verify(email_verify_token, process.env.JWT_SECRET);

    if (validUser && verifyToken._id) {
      const newPassword = await bcrypt.hash(user_password, 10);

      const newUserPassword = await User.findByIdAndUpdate(
        { _id: id },
        { user_password: newPassword },
        { new: true },
      );

      res.status(201).send({
        status: 201,
        success: true,
        message: 'User password changed',
        user: newUserPassword,
      });
    } else {
      res.status(401).send({
        status: 401,
        success: false,
        message: 'User not verified',
      });
    }
  } catch (error) {
    res.status(401).send({
      status: 401,
      success: false,
      message: 'User not verified',
      error,
    });
  }
});

module.exports = router;