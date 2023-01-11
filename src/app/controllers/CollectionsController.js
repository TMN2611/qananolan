const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require('../../util/mongoose');
const ProductModel = require('../../app/models/Product');
const BrandModel = require('../../app/models/Brand');


function sort (products,sortBy) {


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
    return products.sort(function(a,b) {
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
    let products = await ProductModel.find({ productGender: 'Male' });

    const {sortBy} = req.query;
    if(sortBy) {
      products= sort(products,sortBy);
    }

   

    res.render('collections/maleProduct', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req),
      pageTitle:`Sản phẩm Nam - ${process.env.DOMAINNAME}`
    });
  }
  async femaleProduct(req, res) {
    let products = await ProductModel.find({ productGender: 'Female' });
    const {sortBy} = req.query;
    if(sortBy) {
      products= sort(products,sortBy);
    }

    res.render('collections/femaleProduct', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req),
      pageTitle:`Sản phẩm Nữ - ${process.env.DOMAINNAME}`


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
      path:getPathName(req),
      pageTitle:`Sản phẩm Unisex - ${process.env.DOMAINNAME}`


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
      path:getPathName(req),
      pageTitle:`Khuyến mãi- ${process.env.DOMAINNAME}`


    });
  }
  async allProduct(req, res) {
    let products = await ProductModel.find();
    const {sortBy} = req.query;
    if(sortBy) {
      products= sort(products,sortBy);
    }
    // Get list brand
    const brandList = await BrandModel.find();
    //  Get List color
    let uniqueColor = [];
    products.forEach((c) => {
        if (!uniqueColor.includes(c.productColor)) {
            uniqueColor.push(c.productColor);
        }
    });
    // Price range
    let priceRange = [
      {from:0, to:200000,valueString:"Dưới 200.000đ"},
      {from:200000, to:400000,valueString:"200.000đ-400.000đ"},
      {from:400000, to:1000000,valueString:"400.000đ-1.000.000đ"}, 
      {from:1000000, to:99999999999,valueString:"Trên 1.000.000đ"}
    ];

    

  
    res.render('collections/allProduct', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req),
      brandList:mutipleMongooseToObject(brandList),
      listColor:uniqueColor,
      priceRange,
      pageTitle:`Tất cả sản phẩm - ${process.env.DOMAINNAME}`

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
      path:getPathName(req),
      pageTitle:`Hàng mới - ${process.env.DOMAINNAME}`

    });
  }

  async brandProduct(req, res) {
    const brandName = req.params.name;

    let products = await ProductModel.find({ brand: brandName});
    const {sortBy} = req.query;
    if(sortBy) {
      products= sort(products,sortBy);
    }

    res.render('collections/brandProduct', {
      products: mutipleMongooseToObject(products),
      path:getPathName(req),
      brandName:brandName,
      pageTitle:`Sản phẩm Unisex - ${process.env.DOMAINNAME}`


    });
  }
}

module.exports = new CollectionsController();
