const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require('../../util/mongoose');
const ProductModel = require('../models/Product');

class CollectionsController {
  //  [GET]  / search
  async index(req, res) {

    const {type,text} = req.query; 


    let searchResult ;
    if(type === 'product') {

      const products = await ProductModel.find({});

      const splitTextSearh = text.split(' ');
     
      const searchedProduct = products.filter(product => {

        const isContainAllTextSearch = splitTextSearh.every((item,index)=> {
          return product.productName.toUpperCase().includes(item.toUpperCase().trim());
         })

         return isContainAllTextSearch;

      });

      console.log(searchedProduct);

      searchResult = searchedProduct

    }


    return  res.render('search',{
      products:mutipleMongooseToObject(searchResult),
      quatity:searchResult.length,
      resultSearchedFor:text
    });

  }
}

module.exports = new CollectionsController();
