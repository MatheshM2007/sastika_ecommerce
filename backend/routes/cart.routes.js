const express = require('express');
const cartController = require('../controllers/cart.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  addCartSchema,
  updateCartSchema,
  removeCartSchema,
} = require('../validators/cart.validator');

const router = express.Router();

router.use(auth);

router.get('/', cartController.getCart);
router.post('/add', validate(addCartSchema), cartController.addToCart);
router.put('/update', validate(updateCartSchema), cartController.updateCart);
router.delete('/remove', validate(removeCartSchema), cartController.removeFromCart);

module.exports = router;
