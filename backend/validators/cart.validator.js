const Joi = require('joi');

const addCartSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).default(1),
});

const updateCartSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const removeCartSchema = Joi.object({
  product_id: Joi.number().integer().positive().required(),
});

module.exports = { addCartSchema, updateCartSchema, removeCartSchema };
