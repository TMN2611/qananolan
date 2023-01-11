const ProductModel = require("../models/Product");
const BrandModel = require("../models/Brand");
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const provincesJSON = require('../../resource/json/provinces.json')
const { getProducts } = require('../../util/getDataFromDB')
const axios = require('axios').default;
var jwt = require('jsonwebtoken');

class ApisController {
  //  [POST]  / products
  async productsWithFilter(req, res) {


    let {gender="",brand="",color="",price=""} = req.body;


    const products = await getProducts();

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
  
     res.json({products:newProducts})
    
    // res.render('home',{products:mutipleMongooseToObject(products)});
  }


  async getProvinces(req, res) {
    res.json(provincesJSON);
  }

  // [POST] /apis/calculte-ship-pricef
  async calculateShipPrice(req , res) {



   const data =  req.body;
    const {address:userAdress,cartProductId} = data      
      const pickAdress = {
          ward:"Tây Thạnh",
          district:"Tân Phú",
          provinces:"Hồ Chí Minh",
          street: "Lê Trọng Tấn",
          adress: "140 Lê Trọng Tấn",
      }


      const productInCart = await Promise.all(
        cartProductId.map(async item => {
          const res = await ProductModel.find({_id:item.id})
          const resObject = [...res];
          resObject.amount = item.amount;

          return resObject
        })
      );
      const totalPrice = productInCart.reduce((sum, item)=> {
        const newItem = item[0];
        if(newItem.sale > 0) {
          return sum + (Number(newItem.productSalePrice)*item["amount"])
        }
        else {
          return sum + (newItem.productPrice * item["amount"])
        }
        
      },0)
    

      const totalWeight = productInCart.reduce(function(sum,item) {
        const newItem = item[0];
        return sum + Number(newItem.weight * item["amount"]);
      },0)
  
  
    
      var url = `${process.env.GHTKDOMAINNAME}/services/shipment/fee?address=${userAdress.detailAddress}&province=${userAdress.provinces}&district=${userAdress.district}&ward=${userAdress.ward}&pick_street=${pickAdress.street}&pick_province=${pickAdress.provinces}&pick_district=${pickAdress.district}&pick_ward=${pickAdress.ward}&value=${totalPrice}&weight=${totalWeight}&deliver_option=&transport=road&pick__address=${pickAdress.address}`;

      const header = {"headers":{"Token":process.env.GHTKTOKEN}};


      async function  caculateShipPrice (url) {
				console.log("Thành công");

        const res = await axios.get(url,header );
        return res.data
      }
      
      

      const dataprice = await caculateShipPrice(encodeURI(url));
  
      const newdataprice = {...dataprice,orderWeight:totalWeight}
      

      res.json(newdataprice)

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

 
}

module.exports = new ApisController();
