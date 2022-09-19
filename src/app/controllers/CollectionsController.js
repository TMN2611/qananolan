const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require('../../util/mongoose');
const ProductModel = require('../../app/models/Product');
const BrandModel = require('../../app/models/Brand');


function sort (products,sortBy) {

  console.log(sortBy);

  if(sortBy =='newest') {
    //  ĐỢI LÀM CHỨC NĂNG THÊM SẢN PHẨM ĐỂ CÓ TRƯỜNG CREATEAT
    return products.reverse();
  }
  else if(sortBy =='price-ascending') {
    return products.sort(function(a,b) {
      return a.productPrice - b.productPrice;
    })
  }
  else if(sortBy =='best-sale') {
    console.log(products,"jaa");
    return products.sort(function(a,b) {
      console.log(b.quantitySold);
      return b.quantitySold - a.quantitySold;
    })
  }
  else {
    return products
  }
    
} 

function getPathName (req) {
  return req.originalUrl;
}

class CollectionsController {
  //  [GET]  /
  async maleProduct(req, res) {
    let products = await ProductModel.find({ productGender: 'Nam' });

    const {sortBy} = req.query;
    if(sortBy) {
      products= sort(products,sortBy);
    }

   

    res.render('collections/maleProduct', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req)
    });
  }
  async femaleProduct(req, res) {
    let products = await ProductModel.find({ productGender: 'Nữ' });
    const {sortBy} = req.query;
    if(sortBy) {
      products= sort(products,sortBy);
    }

    res.render('collections/femaleProduct', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req)

    });
  }
  async unisexProduct(req, res) {
    let products = await ProductModel.find({ productGender: 'Unisex' });
    const {sortBy} = req.query;
    if(sortBy) {
      products= sort(products,sortBy);
    }

    res.render('collections/unisexProduct', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req)

    });
  }

  async saleProduct(req, res) {
    let products = await ProductModel.find();
    const {sortBy} = req.query;
    if(sortBy) {
      products= sort(products,sortBy);
    }
    const saleProduct = products.filter(product => {
      return product.sale !== 0;
    });

    res.render('collections/saleProduct', {
      products: mutipleMongooseToObject(saleProduct),
      path:getPathName(req)

    });
  }
  async allProduct(req, res) {
    let products = await ProductModel.find();
    const {sortBy} = req.query;
    if(sortBy) {
      products= sort(products,sortBy);
    }
    const brandList = await BrandModel.find();
  
    res.render('collections/allProduct', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req),
      brandList:mutipleMongooseToObject(brandList)
    });
  }

  async newArrivalProduct(req, res) {
    let products = await ProductModel.find();
    const {sortBy = 'newest'} = req.query;

    if(sortBy) {
      products= sort(products,sortBy);
    }
  
    res.render('collections/newArrival', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req)
    });
  }
}

module.exports = new CollectionsController();
