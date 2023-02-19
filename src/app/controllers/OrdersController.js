const OrderModel = require("../models/Order")
const ProductModel = require("../models/Product")
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const provincesJSON = require('../../resource/json/provinces.json')
const { numberToMoney } = require('../../util/numberToMoney')
const axios = require('axios').default;
const jwt = require('jsonwebtoken');
const {calculateShipPrice,getDiscountFromId} = require('../../util/calculatePriceBeforeSaveToDB');
var nodemailer = require('nodemailer');
const fs = require('fs');
const hbs = require('nodemailer-express-handlebars')
  const path = require('path')



class OrdersController {
  //  [GET]  / checkouts


  async checkouts(req, res) {
      const token = req.params;
      console.log(token,Math.random);


      res.render('orders/checkouts')
  }

  async handleOrder(req, res) {
    try {
            
        let {userInfor,discountCode,orderPayOption,productInfor,totalPriceFromClient,note} = req.body;
        // Tính lại tổng giá đơn hàng và so sánh với giá trị gửi lên từ client ( sau khi giảm giá );

        const reViewProductInfor  = productInfor.map(async item=> {

          
          const currItemFromDB = await ProductModel.findById({_id:item.cartItemId});

          const {sale,productSalePrice,productPrice} = currItemFromDB
          const currItemPrice = sale ? productSalePrice : productPrice;

          if(currItemPrice !== item.cartItemPrice){
            // return res.json({isError:true, message:"Giá sản phẩm hiện tại không đúng"});
            item.cartItemPrice = currItemPrice
          }
          return item;

        })
        Promise.all(reViewProductInfor).then(async (productList) => {
          // Tính tổng giá tiền ( chưa giảm giá );

          let totalMoney = productList.reduce((total,curr,index)=> {
            return total+ (curr.cartItemPrice * curr.cartItemAmount)  ;
          },0)




          // GET giá ship

          async function getShipmentFee () {
            const cartProductId = productList.map((item)=> 
            {
              return {id:item.cartItemId,amount:item.cartItemAmount };
            })
      
      
            const shipmentFee = await calculateShipPrice({cartProductId,address:userInfor.address});
            const {fee:feeObject} = shipmentFee ;
            
            return feeObject.fee;
          }
          let shipmentFee = await getShipmentFee();
          const initshipmentFee = shipmentFee;

          if( totalMoney !== totalPriceFromClient) {
            totalPriceFromClient = totalMoney;
            return res.json({isErros:true,message: 'Giá không hợp lệ'});
          }


          // Áp dụng giảm giá

          let isError = false;
          async function ApplyDiscount() {

          
            const priceWithDiscountList = await discountCode.map(async (id)=> {
              const {priceWithDiscount,isSuccess} = await getDiscountFromId({id,    productPrice:totalMoney,shipmentFee},req,res);
                if(isSuccess === false){
                  isError = true;
                }
  
                return await priceWithDiscount;

              });

            
            await Promise.all(priceWithDiscountList).then((values) => {
                values.forEach(discount=> {
                      const {type,newFee} = discount;
                      if(type === "price") {
                        totalMoney = newFee;    
                      }
                      if(type === "ship") {
                        shipmentFee = newFee;
                      }
                })
              });
          }
          await ApplyDiscount();

          if(isError) {
             console.log("Thất bai")
          }
          else {
           //  Giá hợp lệ
            
            // Gửi Email
            function sendEmailAcceptToClient(orderId,orderDate,finalPrice,discount) {

                
              //  Nodejs Email with nodemailer
              var transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: `${process.env.EMAILADDRESS}`,
                    pass: `${process.env.EMAILPASSWORD}`,
                },
              });


              // point to the template folder
              const handlebarOptions = {
                viewEngine: {
                  extName: ".hbs",
                  partialsDir: path.resolve("/.src/resource/views/"),
                  defaultLayout: false,
                },
                viewPath: path.resolve('./src/resource/views'),
                extName: ".hbs",
              };

              // use a template file with nodemailer
              transporter.use('compile', hbs(handlebarOptions))

             
              

              // const attachmentList = productInfor.map(function (product) {
              //   return {   // stream as an attachment
              //     path: `${process.env.DOMAINNAME}${product.cartItemImgUrl}`
              //   }
              // });
              // console.log("🚀 ~ file: OrdersController.js:156 ~ OrdersController ~ attachmentList ~ attachmentList", attachmentList)
              
              var mailOptions = {
                from: `"QANA NOLAN" ${process.env.EMAILADDRESS}`,
                to: `${userInfor.email}`,
                subject: 'XÁC NHẬN ĐẶT HÀNG',
                text: 'Xin chào bạn',
                // attachments:attachmentList,
                
                template:'email',
                context: {
                  username:userInfor.name,
                  address: userInfor.address,
                  orderId:orderId,
                  orderDate,
                  finalPrice,
                  discount,
                  productInfor,
                  
                }
              
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
              });

             }



              // Lưu vào Database;

              const priceWithDiscount = totalMoney +  shipmentFee;
              const discount = (totalPriceFromClient + initshipmentFee) - priceWithDiscount
              
              
              const dataForSave = {
                price:totalMoney,
                ship:shipmentFee,
                finalPrice:priceWithDiscount ,
                discount ,
                userInfor,
                orderPayOption,
                productList,
                note        
              }

              OrderModel.create(dataForSave, async function (err, small) {
                // if (err) console.log(err);
                // saved!
            

                let date = ("0" + small.createdAt.getDate()).slice(-2);
                let month = ("0" + (small.createdAt.getMonth() + 1)).slice(-2);
                let year = small.createdAt.getFullYear();
                const orderDate = `${date} - ${month} - ${year}  `
                
                  sendEmailAcceptToClient(small._id,orderDate,await numberToMoney(priceWithDiscount),await numberToMoney(discount));

                  const productHaveOrder = small.productList;

                  productHaveOrder.forEach(product => {
                    ProductModel.findByIdAndUpdate()
                  })


                  res.json({isError:false,message:"Đặt hàng thành công, vui lòng kiểm tra email và chờ CSKH liên hệ"});

                
              });

              }

        
            
      
        })
      
    } catch (error) {
        console.log(error)
    }

  }

}

module.exports = new OrdersController();
