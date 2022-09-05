const ProductModel = require("../models/Product")
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { getProducts } = require('../../util/getDataFromDB')


class SiteController {
  //  [GET]  /
  async index(req, res) {
    const isSpecial = true;
    const products = await getProducts(isSpecial);
    res.render('home',{products:mutipleMongooseToObject(products)});
  }

  // [GET] /search
  search(req, res) {
    res.render('search');
  }
}

module.exports = new SiteController();
