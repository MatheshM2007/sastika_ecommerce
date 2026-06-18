const express = require('express');
const bannerController = require('../controllers/banner.controller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Public - get active banners
router.get('/active', bannerController.listActiveBanners);

// Admin only
router.get('/', auth, admin, bannerController.listAllBanners);
router.post('/', auth, admin, bannerController.createBanner);
router.put('/:id', auth, admin, bannerController.updateBanner);
router.delete('/:id', auth, admin, bannerController.deleteBanner);

module.exports = router;