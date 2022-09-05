const express = require('express');

const router = express.Router();

const CollectionsController = require('../app/controllers/CollectionsController');

router.get('/san-pham-nam', CollectionsController.maleProduct);
router.get('/san-pham-nu', CollectionsController.femaleProduct);
router.get('/sale', CollectionsController.saleProduct);
router.get('/tat-ca-san-pham', CollectionsController.allProduct);

module.exports = router;
