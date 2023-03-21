const ProductModel = require("../models/Product")
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { getProducts } = require('../../util/getDataFromDB')
const { filterAvailableProduct} = require('../../util/ignoreProduct')


class SiteController {
  //  [GET]  /
  async index(req, res) {

    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    const isSpecial = true;
    const productsCollection = await getProducts(isSpecial);
    let products = await filterAvailableProduct(productsCollection)

    const newestProduct = await ProductModel.find({isAvailable:true}).sort({ _id: -1}).limit(1)
    const newestProductObject = mongooseToObject(newestProduct[0]);
    const newestProductAvatar = newestProductObject?.productImg?.[0];
  
 
    res.render('home',
    {products:mutipleMongooseToObject(products),pageTitle:`QANANOLAN - ${process.env.DOMAINNAME}`,newestProductAvatar,newestProduct:newestProductObject});
  }



  // [GET] /cart
  cart(req, res) {
    res.render('cart',{pageTitle:`Giỏ hàng của bạn - ${process.env.DOMAINNAME}`});
  }

  // [GET] /cart
  checkouts(req, res) {
    res.render('cart',{pageTitle:`Giỏ hàng của bạn - ${process.env.DOMAINNAME}`});
  }

   //  [GET]  / tra-cuu
   async searchOrder(req, res) { 
    res.render('searchOrder',{pageTitle:`Tra cứu - ${process.env.DOMAINNAME}`})
  }
}

module.exports = new SiteController();
