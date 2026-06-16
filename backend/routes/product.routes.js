const express = require('express');
const productController = require('../controllers/product.controller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { productSchema, productQuerySchema } = require('../validators/product.validator');

const router = express.Router();

router.get('/', validate(productQuerySchema, 'query'), productController.listProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProduct);

router.post(
  '/',
  auth,
  admin,
  upload.single('image'),
  validate(productSchema),
  productController.createProduct
);
router.put(
  '/:id',
  auth,
  admin,
  upload.single('image'),
  productController.updateProduct
);
router.delete('/:id', auth, admin, productController.deleteProduct);

module.exports = router;
