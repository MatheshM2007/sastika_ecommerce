const Joi = require('joi');

const productSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().allow('', null),
  price: Joi.number().positive().required(),
  mrp: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().min(2).max(100).required(),
  image_url: Joi.string().uri().allow('', null),
  is_active: Joi.boolean(),
});

const productQuerySchema = Joi.object({
  search: Joi.string().allow(''),
  category: Joi.string().allow(''),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
  sort: Joi.string().valid('price_asc', 'price_desc', 'newest').default('newest'),
});

module.exports = { productSchema, productQuerySchema };
