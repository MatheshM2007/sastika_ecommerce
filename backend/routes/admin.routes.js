const express = require('express');
const adminController = require('../controllers/admin.controller');
const orderController = require('../controllers/order.controller');
const productController = require('../controllers/product.controller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.use(auth, admin);

router.get('/dashboard', adminController.dashboard);
router.get('/analytics', adminController.analytics);
router.get('/users', adminController.listUsers);
router.put('/users/:id', adminController.updateUser);
router.get('/orders', orderController.getAllOrdersAdmin);
router.get('/products', productController.listAllProductsAdmin);

module.exports = router;
