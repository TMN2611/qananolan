const express = require('express');

const router = express.Router();

const SearchController = require('../app/controllers/SearchController');


router.get('/', SearchController.index);


module.exports = router;
