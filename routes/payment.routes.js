const router = require('express').Router();

router.post('/pay', (req, res, next) => {
  const { credit_number } = req.body;
  const terminal_number = '1234567890';
  const transaction_date = Date.now()
  const transaction_number = terminal_number + transaction_date;
  const last_digits = credit_number.slice(-4);

  res.status(200).send({
    success: true,
    message: 'Payment Successful',
    paymentStatus: {
      last_digits,
      terminal_number,
      transaction_number,
      transaction_date
    },
  });
});

module.exports = router;