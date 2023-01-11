const express = require('express');

const router = express.Router();

const ApisController = require('../app/controllers/ApisController');

router.post('/productsWithFilter', ApisController.productsWithFilter);
router.get('/provinces', ApisController.getProvinces);
router.post('/calculate-ship-price', ApisController.calculateShipPrice);
router.get('/brand-list', ApisController.getBrandList);

router.get('/token', ApisController.generateToken);


module.exports = router;

