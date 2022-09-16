const localListCart = JSON.parse(localStorage.getItem('cartProductList'));


const listCartId = localListCart.map((item,index)=> item.cartItemId);

function numberToMoney (price) {
    const stringPrice = `${price}`;
   return stringPrice.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ' đ';
}

async function getProductWithIdInCart () {

    const productWithIdInCart = await Promise.all(
        listCartId.map(async (id) => {
          const response = await fetch(`/products/infor/${id}`)
          const todo = await response.json()
          return todo;
        })
      )
    
      const newlocalListCart = localListCart.map((item,index)=> {
        productWithIdInCart.forEach((product)=> {
            if(product._id == item.cartItemId) {
                if(product.sale === 0) {
                    item.cartItemPrice =  product.productPrice;
                    item.cartItemPriceString =  numberToMoney(product.productPrice);
                }
                else {
                    item.cartItemPrice =  product.productSalePrice;
                    item.cartItemPriceString =   numberToMoney(product.productSalePrice);
                }
                
            }
        })

        return item;

      })

      console.log(newlocalListCart);

      localStorage.setItem('cartProductList',JSON.stringify(newlocalListCart))

}
getProductWithIdInCart();