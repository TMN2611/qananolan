const {
    mongooseToObject,
    mutipleMongooseToObject,
  } = require('../../util/mongoose');
const {getProduct} = require('../../util/getDataFromDB')
const DiscountModel = require('../models/Discount');
  
  class DiscountsController {
    //  [GET]  /discount/
    async discount(req, res) {
      const {total} = req.query;

      let discountList =await DiscountModel.find({});

      discountList = discountList.filter((item)=> {
          return item.minOrderPrice < total;
      })

      console.log(discountList);

      return res.json({discountList})
    }
    //  [GET]  /getDiscountFromId/
    async getDiscountFromId(req, res) {
      const {id:discountId,shipmentFee,totalPrice,productPrice} = req.body;
      console.log("🚀 ~ file: DiscountsController.js:19 ~ DiscountsController ~ getDiscountFromId ~ discount", req.body)

  

      

      const discountDB =(await DiscountModel.find({_id:discountId}))[0];
      console.log(discountDB);

      let {decrease, type, unit,minOrderPrice,discountName} = discountDB;



      
  

      // 
      let typeDecrease ;

      if(type === 'price') {
        typeDecrease = productPrice;
        calculate(typeDecrease,type);
      }
      else if(type==='ship'){
        typeDecrease = shipmentFee;
      
        calculate(typeDecrease,type);
      }
      else {

      }

      function calculate() {
          if( unit==='%') {
            decrease =  typeDecrease - (typeDecrease * decrease) / 100;
          }
          else if(unit==='vnd') {
            
            let discountCondition = 0;
            if(type === "price") {
              discountCondition = minOrderPrice
            }

            if(typeDecrease >= discountCondition)
            {
              decrease =  typeDecrease - decrease;
            }
            else {
                return res.json({message: 'Khuyến mãi không được áp dụng với đơn hàng này'});
            }
    
          }
          else {
    
          }
      }


    



      return res.json({discountName,type,currentPrice:typeDecrease,newFee:decrease,decrease:typeDecrease - decrease,unit})
    }
  }
  
  module.exports = new DiscountsController();
  