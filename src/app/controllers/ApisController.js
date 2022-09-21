const ProductModel = require("../models/Product")
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { getProducts } = require('../../util/getDataFromDB')


class ApisController {
  //  [POST]  / products
  async productsWithFilter(req, res) {

    console.log(req.body);

    let {gender="",brand="",color="",price=""} = req.body;
    console.log(req.query);

    console.log(gender.length)

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
        console.log(save.length);
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



 
}

module.exports = new ApisController();
