const ProductModel = require("../models/Product");
const BrandModel = require("../models/Brand");
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const provincesJSON = require('../../resource/json/provinces.json')
const { getProducts } = require('../../util/getDataFromDB')
const axios = require('axios').default;
var jwt = require('jsonwebtoken');
const {calculateShipPrice} = require('../../util/calculatePriceBeforeSaveToDB')

class ApisController {
  //  [POST]  / products
  async productsWithFilter(req, res) {


    let {gender="",brand="",color="",price=""} = req.body;

    console.log(req.body);


    let products = await ProductModel.find({});
    console.log(products.length);

    let newProducts= [];
    if(gender.length !== 0) {
      newProducts = products.filter((product)=> {
        return gender.includes(product.productGender)
    })
    
    }

    if(brand.length !== 0) {
      newProducts = newProducts.filter((product)=> {
        return brand.includes(product.brand)  
      })
    }
    if(brand.length !== 0 && gender.length === 0) {
      newProducts = products.filter((product)=> {
        return  brand.includes(product.brand)  
      })
    }

    if(price.length !== 0) {
      
      price.forEach((price)=> {
        const splitPriceString = price.split("-");
        const from = Number(splitPriceString[0]);
        const to = Number(splitPriceString[1]);
        newProducts = newProducts.filter((product)=> {
          return  product.productPrice > from && product.productPrice <= to ;
        })
      })
   

    }

    if(price.length !== 0 && gender.length === 0 && brand.length === 0) {
      
      let save = [];
      price.forEach((price)=> {
        const splitPriceString = price.split("-");
        const from = Number(splitPriceString[0]);
        const to = Number(splitPriceString[1]);
        save = products.filter((product)=> {
          return  product.productPrice > from && product.productPrice <= to ;
        })
        newProducts = newProducts.concat(save)
      })

    }

    if(color.length !== 0 ) {
      newProducts = newProducts.filter((product)=> {
        return  color.includes(product.productColor) 
      })
    }
    if(color.length !== 0 && gender.length === 0 && brand.length === 0 && price.length === 0) {
      newProducts = products.filter((product)=> {
        return  color.includes(product.productColor) 
      })

    }
    if(color.length === 0 && gender.length === 0 && brand.length === 0 && price.length === 0) {
      newProducts = products.filter((product)=> {
        return  product
      })

    }
    console.log(newProducts);
  
     res.json({products:newProducts})
     products = [];
    
    // res.render('home',{products:mutipleMongooseToObject(products)});
  }


  async getProvinces(req, res) {
    res.json(provincesJSON);
  }

  // [POST] /apis/calculte-ship-price
  async calculateShipPrice(req , res) {

   const data =  req.body;

      const newDataprice =await calculateShipPrice(data);
      
      res.json(newDataprice)

  }

  // GET /apis/token

  async generateToken(req, res) {
      const token = jwt.sign({
        data: new Date()
      }, process.env.SECRET_KEY);

      res.json({token})
  }
  // GET /apis/brand-list

  async getBrandList(req, res) {
      const brandList =await BrandModel.find({});

      res.json(brandList)
  }


  //  POST /apis/get-total-price

  async getTotalPrice(req, res) {

    let cartProductList  = req.body;

    const totalMoney = cartProductList.reduce((total,curr,index)=> {
      return total+ (curr.cartItemPrice * curr.cartItemAmount)  ;
    },0)

    res.json(totalMoney)
}



 
}

module.exports = new ApisController();
