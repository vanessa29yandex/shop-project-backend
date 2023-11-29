const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const corsOptions = require('./config/corsOptions');
const originCredentials = require('./middlewares/originCredentials');

const refreshRouter = require ('./routes/refresh.routes');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users.routes');
const cartRouter = require('./routes/cart.routes');
const mailerRouter = require('./routes/emails.routes');
const categoriesRouter = require('./routes/categories.routes');
const productsRouter = require('./routes/products.routes');
const ordersRouter = require('./routes/orders.routes')
const paymentsRouter = require('./routes/payment.routes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(originCredentials)
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/refresh', refreshRouter);
app.use('/cart', cartRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);
app.use('/mailer', mailerRouter);
app.use('/payments', paymentsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(1, err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(2, err);
  
  // render the error page
  res.status(err.status || 500);
  res.send({errorMessage: err.message, errorStatus: err.status || 500});
});

module.exports = app;
