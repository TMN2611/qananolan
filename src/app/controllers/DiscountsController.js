const {
    mongooseToObject,
    mutipleMongooseToObject,
  } = require('../../util/mongoose');
const {getProduct} = require('../../util/getDataFromDB')
const {getDiscountFromId} = require('../../util/calculatePriceBeforeSaveToDB')
const DiscountModel = require('../models/Discount');
  
  class DiscountsController {
    //  [GET]  /discount/
    async discount(req, res) {
      const {total} = req.query;

      let discountList =await DiscountModel.find({isAvailable:true});

      discountList = discountList.filter((item)=> {
          return item.minOrderPrice < total;
      })


      return res.json({discountList})
    }
    //  [GET]  /getDiscountFromId/
    async getDiscountFromId(req, res) {
       const data = req.body;

       const priceWithDiscount =  await getDiscountFromId(data,req,res);
       console.log("🚀 ~ file: DiscountsController.js:28 ~ DiscountsController ~ getDiscountFromId ~ priceWithDiscount", priceWithDiscount)

    
      return res.json(priceWithDiscount)
    }
  }
  
  module.exports = new DiscountsController();
  