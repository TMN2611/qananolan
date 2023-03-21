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
   
      const productAvatar = mongooseToObject(productInfor)?.productImg?.[0];
      const hotline = process.env.ADMIN_PHONE;
      res.render('products/detailProduct', {
        productInfor: mongooseToObject(productInfor),
        pageTitle:`${productInfor?.productName}- ${process.env.DOMAINNAME}`,
        productAvatar,
        hotline
      });
    }

    // [GET] /product/id
    async productInfor(req, res) {
      const id = req.params.id;
      const productInfor = await ProductModel.findOne({_id:id});
      res.json(productInfor);
    }
  }
  
  module.exports = new ProductsController();
  