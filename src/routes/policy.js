const express = require('express');

const router = express.Router();

const PolicyController = require('../app/controllers/PolicyController');

router.get('/gioi-thieu/', PolicyController.introduce);
router.get('/chon-size/', PolicyController.sizeguide);
router.get('/thanh-toan/', PolicyController.payment);
router.get('/doi-tra/', PolicyController.replacement);
router.get('/bao-mat/', PolicyController.security);
router.get('/giao-hang/', PolicyController.shipment);


module.exports = router;
