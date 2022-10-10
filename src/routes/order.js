const express = require('express');

const router = express.Router();

const OrdersController = require('../app/controllers/OrdersController');
const {requireToken} = require('../middleware/auth')

router.get('/checkouts/:token',requireToken, OrdersController.checkouts);


module.exports = router;
