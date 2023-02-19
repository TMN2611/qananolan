const OrderModel = require("../models/Order");
const ProductModel = require("../models/Product");

const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { getProducts } = require('../../util/getDataFromDB')
var jwt = require('jsonwebtoken');
var {numberToMoney} = require("../../util/numberToMoney");
const {textAreaSpace,inputSpace} = require('../../util/handleInput')



class AuthCotroller {
  //  [GET]  / admin/order
  async order(req, res) {
    
    const orderListDocument = await OrderModel.find({});

    const orderList = mutipleMongooseToObject(orderListDocument)
    orderList.map(async function(order) {
      order.ship = await numberToMoney(order.ship);
      order.discount = await numberToMoney(order.discount);
      order.finalPrice = await numberToMoney(order.finalPrice);
      return order;

    });

    const orderWait = orderList.filter((order)=> order.status === 'Waiting')
    const orderConfirmed = orderList.filter((order)=> order.status === 'Confirmed')

    var data = {
      layout: false, 
      orderWait,
      orderConfirmed
    };

    res.render('admin/order',data)
    
  }
  // [ POST ] / admin/order-detail

  async orderDetail(req, res) {
      
      const order = await OrderModel.findById({_id:req.params.id});
      console.log(req.body)
      var data = {
        layout: false, 
        order:mongooseToObject(order)
    };

      res.render('admin/orderDetail',data)
  }
  
  // [ POST ] / admin/order-detail

  async product(req, res) {
    const productList = await ProductModel.find({});
    var data = {
      layout: false, 
      productList:mutipleMongooseToObject(productList)
    };

    res.render('admin/product',data)
  }
  async addproductView(req, res) {
    var data = {
      layout: false, 
    };
    res.render('admin/addproduct',data)
  }
  async addproduct(req, res) {
    console.log(req.files);
    const data = req.body;
    const {productGender,productName,productPrice,productDescription,sale,productColor,productSize,brand,weight} = data;

    const newProductDescription = await textAreaSpace(productDescription);
    const newProductSize = await inputSpace(productSize);
    const numberOfClicks = 0; 
    const quantitySold = 0; 
    const saleNumber = Number(sale);
    const productPriceNumber = Number(productPrice);
    const productSalePrice = productPriceNumber - (productPriceNumber * saleNumber) / 100;


    const productImg = req.files.map(i=> {
      return `/img/Products/${i.originalname}`
    });
    const dataForSave = {
      productName,
      productGender,
      productPrice:productPriceNumber,
      productSalePrice,
      productDescription:newProductDescription,
      sale:saleNumber,
      productColor,
      brand,
      weight:Number(weight),
      productSize:newProductSize,
      numberOfClicks,
      quantitySold,
      productImg,
    }
    console.log(dataForSave)
    
    ProductModel.create(dataForSave)
  


    res.json({isSuccess:true,message:"Thành công"});
  }
  
 
}

module.exports = new AuthCotroller();
