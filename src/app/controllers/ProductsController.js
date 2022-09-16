const {
    mongooseToObject,
    mutipleMongooseToObject,
  } = require('../../util/mongoose');
const {getProduct} = require('../../util/getDataFromDB')
const ProductModel = require('../../app/models/Product');
  
  class ProductsController {
    //  [GET]  /products/:slug
    async productDetail(req, res) {
      const slug = req.params.slug;
      const productInfor = await ProductModel.findOne({slug:slug});
  
      res.render('products/detailProduct', {
        productInfor: mongooseToObject(productInfor),
      });
    }

    // [GET] /product/id
    async productInfor(req, res) {
      const id = req.params.id;
      const productInfor = await ProductModel.findOne({id:id});
      res.json(productInfor);
    
    }


  }
  
  module.exports = new ProductsController();
  