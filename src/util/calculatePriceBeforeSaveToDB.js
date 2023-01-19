const ProductModel = require('../app/models/Product');
const axios = require('axios').default;
const DiscountModel = require('../app/models/Discount');


async function calculateShipPrice(data) {

    
    const {address:userAdress,cartProductId} = data;     

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

    return newdataprice;
  
}

async function getDiscountFromId(data,req,res) {

    const {id:discountId,shipmentFee,productPrice} = data;


    const discountDB =(await DiscountModel.find({_id:discountId}))[0];

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

    const discountPriceData = {discountName,type,currentPrice:typeDecrease,newFee:decrease,decrease:typeDecrease - decrease,unit}

    return discountPriceData;
  
}

module.exports = { calculateShipPrice, getDiscountFromId };
