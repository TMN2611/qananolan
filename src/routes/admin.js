const express = require('express');
const multer = require('multer')
const router = express.Router();
multer().single("undefined")
const AdminController = require('../app/controllers/AdminController');
const {requireAdminToken} = require('../middleware/auth')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './src/public/img' + '/Products');
    },
    // Sets file(s) to be saved in uploads folder in same directory
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
    // Sets saved filename(s) to be original filename(s)
  })
  
// Set saved storage options:
const upload = multer({ storage: storage })
router.get('/orders/:token',requireAdminToken, AdminController.order);
router.get('/products/:token',requireAdminToken, AdminController.product);
router.get('/order-detail/:id/:token', AdminController.orderDetail);
router.get('/them-san-pham/:token',requireAdminToken, AdminController.addproductView);
router.post('/them-san-pham/:token',upload.array("files"),requireAdminToken, AdminController.addproduct);


module.exports = router;
