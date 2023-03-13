const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require('../../util/mongoose');
const ProductModel = require('../models/Product');
const OrderModel = require('../models/Order');
const { filterAvailableProduct} = require('../../util/ignoreProduct')

class SearchsController {
  //  [GET]  / search
  async index(req, res) {

    const {type,text} = req.query;


    let searchResult ;
    if(type === 'product') {

      const productsCollection = await ProductModel.find({});
      let products = await filterAvailableProduct(productsCollection)

      const splitTextSearh = text.split(' ');
     
      const searchedProduct = products.filter(product => {

        const isContainAllTextSearch = splitTextSearh.every((item,index)=> {
          return product.productName.toUpperCase().includes(item.toUpperCase().trim());
         })

         return isContainAllTextSearch;

      });


      searchResult = searchedProduct
      return  res.render('search',{
        products:mutipleMongooseToObject(searchResult),
        quatity:searchResult.length,
        resultSearchedFor:text,
        pageTitle:`Kết quả tìm kiếm "${text}" - ${process.env.DOMAINNAME}`
      });

    }

    if(type === 'order') {
      console.log(text);
      const order = await OrderModel.findById(text.trim());
      console.log("🚀 ~ file: SearchController.js:47 ~ SearchsController ~ index ~ order:", order)


     



      searchResult = searchedProduct
      return  res.render('search',{
        products:mutipleMongooseToObject(searchResult),
        quatity:searchResult.length,
        resultSearchedFor:text,
        pageTitle:`Kết quả tìm kiếm "${text}" - ${process.env.DOMAINNAME}`
      });

    }
  


    

  }

}

module.exports = new SearchsController();
