const ProductModel = require("../models/Product")
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { getProducts } = require('../../util/getDataFromDB')


class SiteController {
  //  [GET]  /
  async index(req, res) {

    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    const isSpecial = true;
    const products = await getProducts(isSpecial);
    res.render('home',
    {products:mutipleMongooseToObject(products),pageTitle:`QANANOLAN - ${process.env.DOMAINNAME}`});
  }



  // [GET] /cart
  cart(req, res) {
    res.render('cart',{pageTitle:`Giỏ hàng của bạn - ${process.env.DOMAINNAME}`});
  }

  // [GET] /cart
  checkouts(req, res) {
    res.render('cart',{pageTitle:`Giỏ hàng của bạn - ${process.env.DOMAINNAME}`});
  }
}

module.exports = new SiteController();
