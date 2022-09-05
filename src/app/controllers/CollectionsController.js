const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require('../../util/mongoose');
const ProductModel = require('../../app/models/Product');

class CollectionsController {
  //  [GET]  /
  async maleProduct(req, res) {
    const products = await ProductModel.find({ productGender: 'Nam' });

    res.render('collections/maleProduct', {
      products: mutipleMongooseToObject(products),
    });
  }
  async femaleProduct(req, res) {
    const products = await ProductModel.find({ productGender: 'Nữ' });

    res.render('collections/femaleProduct', {
      products: mutipleMongooseToObject(products),
    });
  }

  async saleProduct(req, res) {
    const products = await ProductModel.find();
    const saleProduct = products.filter(product => {
      return product.sale !== 0;
    });

    res.render('collections/saleProduct', {
      products: mutipleMongooseToObject(saleProduct),
    });
  }
  async allProduct(req, res) {
    const products = await ProductModel.find();
  
    res.render('collections/allProduct', {
      products: mutipleMongooseToObject(products),
    });
  }
}

module.exports = new CollectionsController();
