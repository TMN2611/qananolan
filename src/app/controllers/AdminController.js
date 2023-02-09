const OrderModel = require("../models/Order");
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { getProducts } = require('../../util/getDataFromDB')
var jwt = require('jsonwebtoken');
var {numberToMoney} = require("../../util/numberToMoney");

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





    var data = {
      layout: false, 
      orderList
  };

    res.render('admin/order',data)
    
  }
  // [ POST ] / admin/order-detail

  async orderDetail(req, res) {
      
      const order = await OrderModel.findById({_id:req.params.id})
      console.log("🚀 ~ file: AdminController.js:43 ~ AuthCotroller ~ orderDetail ~ order", order)
      console.log(req.body)
      var data = {
        layout: false, 
        order:mongooseToObject(order)
    };

      res.render('admin/orderDetail',data)
  }
  
 
}

module.exports = new AuthCotroller();
