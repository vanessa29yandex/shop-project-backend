const express = require('express');
const router = express.Router();
const {getAllOrders, getOrderById, createOrder, updateOrderStatus} = require('../controllers/orders.controller');

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/customer-order', createOrder);
router.patch('/:orderId/status', updateOrderStatus);

module.exports = router;