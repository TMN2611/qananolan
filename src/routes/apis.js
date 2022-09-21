const express = require('express');

const router = express.Router();

const ApisController = require('../app/controllers/ApisController');

router.post('/productsWithFilter', ApisController.productsWithFilter);


module.exports = router;
