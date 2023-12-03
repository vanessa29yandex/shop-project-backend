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

  const {
    user_address: { city, street, building, apartment },
  } = userDetails;

  const address = `${street} ${building}/${apartment}, ${city}`;

  const requestBody = {
    amount: cartTotal,
    currency: "USD",
    payment_method: {
      type: "il_visa_card",
      fields: {
        number: creditNumber || "4111111111111111",
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
    error_payment_url: `${process.env.API_URL}/rejected-payment`,
    complete_payment_url: `${process.env.API_URL}/success-payment`,
    capture: true,
  };

  try {
    const response = await makeRequest("POST", "/v1/payments", requestBody);

    // console.log(response)

    const { id: paymentId, redirect_url: redirectUrl } = response.body.data;

    const transaction_number = paymentId.split("_")[1];
    console.log(transaction_number)
    const last_digits = creditNumber.slice(-4);

    const order = await Order.create({
      user: userDetails._id,
      customer_details,
      payment_details: {
        transaction_number,
        terminal_number: "1234567890",
        transaction_date: response.body.data.created_at,
        last_digits,
      },
      products,
    });

    res.send({
      paymentStatus: {
        redirectUrl,
        paymentId,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }

  // const terminal_number = '1234567890';
  // const transaction_date = Date.now()
  // const transaction_number = terminal_number + transaction_date;
  // const last_digits = credit_number.slice(-4);

  // res.status(200).send({
  //   success: true,
  //   message: 'Payment Successful',
  //   paymentStatus: {
  //     last_digits,
  //     terminal_number,
  //     transaction_number,
  //     transaction_date
  //   },
  // });
};

module.exports = { createPayment };
