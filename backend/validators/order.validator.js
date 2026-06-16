const Joi = require('joi');

const shippingAddressSchema = Joi.object({
  fullName: Joi.string().required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().allow('', null),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().pattern(/^\d{6}$/).required(),
});

const createOrderSchema = Joi.object({
  shipping_address: shippingAddressSchema.required(),
});

const updateStatusSchema = Joi.object({
  order_id: Joi.number().integer().positive().required(),
  status: Joi.string()
    .valid('Order Placed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered')
    .required(),
  tracking_number: Joi.string().allow('', null),
});

const verifyPaymentSchema = Joi.object({
  order_id: Joi.number().integer().positive().required(),
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
});

module.exports = { createOrderSchema, updateStatusSchema, verifyPaymentSchema };
