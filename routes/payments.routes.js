const { createPayment } = require('../controllers/payments.controller');

const router = require('express').Router();

router.post('/pay', createPayment);

module.exports = router;