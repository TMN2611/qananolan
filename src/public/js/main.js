const localListCart = JSON.parse(localStorage.getItem('cartProductList')) || [];

let listCartId = [];
if(localListCart) {
     listCartId = localListCart.map((item,index)=> item.cartItemId);
}

function numberToMoney (price) {
    const stringPrice = `${price}`;
   return stringPrice.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ' đ';
}
// getProductWithIdInCart
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


      localStorage.setItem('cartProductList',JSON.stringify(newlocalListCart))

}

getProductWithIdInCart();

// searchProduct
async function searchProduct() {
    const searchBtnElement = document.getElementById('search__submit');
    searchBtnElement.addEventListener('click',()=> {
        const searchInput = document.getElementById('search__input');
        fetch('/search?' + new URLSearchParams({
            type: 'product',
            text:searchInput.value ,
        })).then(()=>{
            
        })

    })
}
searchProduct();


//  getToken
async function getToken () {

    try {
        const tọken = JSON.parse(localStorage.getItem('token'));
        if(tọken === null) {
            // GET TOKEN - CALL API

            const resJson = await fetch("/apis/token")
            const res = await resJson.json();
            localStorage.setItem("token", JSON.stringify(res.token));

        }
    } catch (error) {
        console.log(error)
    }
    
}
getToken();



function getTotalPrice () {

    const cartProductList = JSON.parse(localStorage.getItem('cartProductList')) || [];
    const totalMoney = cartProductList.reduce((total,curr,index)=> {
                        return total+ (curr.cartItemPrice * curr.cartItemAmount)  ;
                    },0)
                    return totalMoney;
}