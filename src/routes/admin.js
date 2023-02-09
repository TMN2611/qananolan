const express = require('express');

const router = express.Router();

const AdminController = require('../app/controllers/AdminController');
const {requireAdminToken} = require('../middleware/auth')

router.get('/order/:token',requireAdminToken, AdminController.order);
router.get('/order-detail/:id/:token', AdminController.orderDetail);


module.exports = router;
