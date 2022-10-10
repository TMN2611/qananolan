const ProductModel = require("../models/Product")
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const provincesJSON = require('../../resource/json/provinces.json')
const { getProducts } = require('../../util/getDataFromDB')
const axios = require('axios').default;
const jwt = require('jsonwebtoken')


class OrdersController {
  //  [GET]  / checkouts


  async checkouts(req, res) {
      const token = req.params;
      console.log(token,Math.random);

      // jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      //   console.log(decoded.data) // bar
      // });
    
      res.render('orders/checkouts')
  }
}

module.exports = new OrdersController();
