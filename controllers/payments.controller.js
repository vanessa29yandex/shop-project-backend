const { makeRequest } = require("../services/rapydApiRequest");
const Order = require("../models/Order.model");

const createPayment = async (req, res, next) => {
  const {
    cartDetails,
    userDetails,
    cartTotal,
    creditNumber,
    expDate,
    cvv,
    orderDetails,
  } = await req.body;

  console.log(orderDetails);
  const { userId: user, customer_details, products } = orderDetails;

  const expiration_month = expDate.slice(0, 2);
  const expiration_year = expDate.slice(-2);

  const last_digits = creditNumber.slice(-4);

  const {
    user_address: { city, street, building, apartment },
  } = userDetails;

  const address = `${street} ${building}/${apartment}, ${city}`;

  try {
    const order = await Order.create({
      user,
      customer_details,
      payment_details: {
        transaction_number: '1234567890' + Date.now(),
        terminal_number: '1234567890',
        last_digits,
      },
      products,
    });

    const requestBody = {
      amount: cartTotal,
      currency: 'USD',
      payment_method: {
        type: 'il_visa_card',
        fields: {
          number: creditNumber,
          expiration_month,
          expiration_year,
          name: userDetails.user_name,
          cvv,
          address,
        },
        metadata: {
          merchant_defined: true,
        },
      },
      error_payment_url: `${process.env.CLIENT_URL}/rejected-payment`,
      complete_payment_url: `${process.env.CLIENT_URL}/success-payment?token=${order._id}`,
      capture: true,
    };

    const response = await makeRequest('POST', '/v1/payments', requestBody);

    const { redirect_url: redirectUrl } = response.body.data;

    res.send({
      paymentStatus: {
        redirectUrl,
        token: order._id,
      },
    });

  } catch (error) {
    console.log(error);
    next(error);
  }

};

module.exports = { createPayment };
