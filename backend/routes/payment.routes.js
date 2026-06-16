const express = require('express');
const paymentController = require('../controllers/payment.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { verifyPaymentSchema } = require('../validators/order.validator');

const router = express.Router();

router.post('/verify', auth, validate(verifyPaymentSchema), paymentController.verifyPayment);

module.exports = router;
