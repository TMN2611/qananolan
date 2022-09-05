const {
    mongooseToObject,
    mutipleMongooseToObject,
  } = require('../../util/mongoose');
const {getProduct} = require('../../util/getDataFromDB')
const ProductModel = require('../../app/models/Product');
  
  class ProductsController {
    //  [GET]  /
    async productDetail(req, res) {
      const slug = req.params.slug;
      const productInfor = await ProductModel.findOne({slug:slug});
  
      res.render('products/detailProduct', {
        productInfor: mongooseToObject(productInfor),
      });
    }
  }
  
  module.exports = new ProductsController();
  