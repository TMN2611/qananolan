  
async function filterAvailableProduct(products) {
      products.map(function (product) {
            if (product.quantitySold >= 1000) {
                product.quantitySold =  (product.quantitySold / 1000).toFixed(1) + 'k';
            } else {
                product.quantitySold = product.quantitySold.toString();
            }
            return product
      })
      return products.filter(product => {
            
          return product.isAvailable? true : false;
      })
}


module.exports = { filterAvailableProduct };
