const express = require('express');

const router = express.Router();

const AdminController = require('../app/controllers/AdminController');
const {requireToken} = require('../middleware/auth')

router.get('/login', AdminController.login);
router.post('/handle-login', AdminController.handleLogin);
router.get('/signup', AdminController.signup);
router.post('/handle-signup', AdminController.handleSignup);


module.exports = router;
