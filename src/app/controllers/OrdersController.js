const DiscountModel = require("../models/Discount")
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


      res.render('orders/checkouts')
  }

}

module.exports = new OrdersController();
