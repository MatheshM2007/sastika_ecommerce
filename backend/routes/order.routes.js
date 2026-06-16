const express = require('express');
const orderController = require('../controllers/order.controller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validate = require('../middleware/validate');
const { createOrderSchema, updateStatusSchema } = require('../validators/order.validator');

const router = express.Router();

router.post('/', auth, validate(createOrderSchema), orderController.createOrder);
router.get('/', auth, orderController.getOrders);
router.get('/:id', auth, orderController.getOrderById);
router.put('/status', auth, admin, validate(updateStatusSchema), orderController.updateOrderStatus);

module.exports = router;
