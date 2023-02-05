var mongoose = require('mongoose');


var Order = mongoose.Schema(
  {
    price: Number,
    ship: Number,
    finalPrice: Number,
    discount:Number,
    userInfor:Object,
    orderPayOption:String,
    productList:[{type:Object}],
    note:String,
    status:{type:String,default:'Waiting'},
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Order', Order);
