const express = require('express');

const router = express.Router();

const ProductsController = require('../app/controllers/ProductsController');

router.get('/:slug', ProductsController.productDetail);


module.exports = router;
