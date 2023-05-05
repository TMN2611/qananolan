const OrderModel = require("../models/Order");
const ProductModel = require("../models/Product");
const BrandModel = require("../models/Brand");
const moment = require("moment");
require('moment/locale/vi');
const fs = require('fs');

const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { getProducts } = require('../../util/getDataFromDB')
var jwt = require('jsonwebtoken');
var {numberToMoney} = require("../../util/numberToMoney");
const {textAreaSpace,inputSpace} = require('../../util/handleInput');
const {exportTimeString} = require('../../util/time');
const { findById } = require("../models/Product");

try {

  class AuthCotroller {
    //  [GET]  / admin/order
    async order(req, res) {
      
      const orderListDocument = await OrderModel.find({});
  
      const orderList = mutipleMongooseToObject(orderListDocument)
      orderList.map(async function(order) {
        order.ship = await numberToMoney(order.ship);
        order.discount = await numberToMoney(order.discount);
        order.finalPrice = await numberToMoney(order.finalPrice);
        const a = order.createdAt;
        const b = moment(a).fromNow();
        order.orderTimeFromNow = b;
        const {orderDate} =await exportTimeString(order.createdAt);
        order.orderDate = orderDate;
        return order;
  
      });
      
  
      const orderWait = orderList.filter((order)=> order.status === 'Waiting');
      const orderConfirm = orderList.filter((order)=> order.status === 'Confirm').reverse();
      const orderCancel = orderList.filter((order)=> order.status === 'Cancel').reverse();
    
      var data = {
        layout: false, 
        orderWait,
        orderConfirm,
        orderCancel
      };
  
      res.render('admin/order',data)
      
    }
    // [ POST ] / admin/order-detail
    async orderDetail(req, res) {
        
        const order = await OrderModel.findById({_id:req.params.id});
        const shipString = await numberToMoney(order.ship);
        const discountString =await  numberToMoney(order.discount);
        const finalPriceString =await  numberToMoney(order.finalPrice);
        const {orderDate,orderTime} = await exportTimeString(order.createdAt);
        
        
  
  
        var data = {
          layout: false, 
          order:mongooseToObject(order),
          token:req.params.token,
          shipString,
          discountString,
          finalPriceString,
          orderDate,
          orderTime
  
      };
  
        res.render('admin/orderDetail',data)
    }
     // [ POST ] / admin/order-detail
  
    async product(req, res) {
      let productList = await ProductModel.find({})
      var data = {
        layout: false, 
        token:req.params.token,
        productList:mutipleMongooseToObject(productList)
      };
  
      res.render('admin/product',data)
    }
  
    
    async editProduct(req, res) {
      const product = await ProductModel.findById(req.params.id);
      console.log("🚀 ~ file: AdminController.js:93 ~ AuthCotroller ~ editProduct ~ product:", typeof (product.quantitySold))
  
      const isAvailable = product.isAvailable;
  
      const brandList = await BrandModel.find({});
  
      const listSize = product.productSize.join(" ");
     
    
      var data = {
        token:req.params.id,
        layout: false, 
        isAvailable,
        brandList:mutipleMongooseToObject(brandList),
        product:mongooseToObject(product),
        listSize,
      };
  
      res.render('admin/editproduct',data);
    }
    // [POST]
    async editProductHandle(req, res) {
      const {productName,productGender,productPrice,productDescription,sale,productColor,productSize,brand,weight} = req.body;
      const productImg = req.files.map(i=> {
        return `/img/Products/${i.originalname}`
      });
  
  
      if(productImg.length !== 0) {
        req.body.productImg = productImg
      }
      req.body.productDescription = await textAreaSpace(productDescription);
    
      req.body.productSize = await inputSpace(productSize);
      req.body.productPrice = Number(productPrice).toFixed(0);
      req.body.productSalePrice = (productPrice - (productPrice * sale) / 100).toFixed(0);
  
      console.log(req.body)
      
      try {
        // Update the product
          let productToUpdate = await ProductModel.findById(req.params.id);
  
          if (!productToUpdate) {
            throw new NotFoundError();
          }
  
          productToUpdate.set(req.body);
  
          await productToUpdate.save();
          const product = await ProductModel.findById(req.params.id);
          res.send({isSuccess:true})
  
      } catch (error) {
          console.log(error);
      }
      
    }
  
    async deleteProduct(req, res) {
      ProductModel.findOneAndDelete({_id: {$gte:req.params.id} }, function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
  
          try {
              var files = docs.productImg ;
        
      

              function deleteFiles(files){
                for (const file of files) {
                  fs.unlink((`./src/public/${file}`), err => {
                  });
                };
              }
      
              deleteFiles(files);
          } catch (error) {
              console.log(error)
          }
          
         res.redirect(`/admin/products/${req.params.token}`);
        }
     });
      
    }
    async toggleProduct(req, res) {
  
  
  
      const product =await ProductModel.findOne({_id: req.params.id})
  
  
      product.set({isAvailable:!product.isAvailable});
        
      await product.save();
  
      res.redirect(`/admin/products/${req.params.token}`);
      
    }
    async addproductView(req, res) {
      var data = {
        layout: false, 
      };
      res.render('admin/addproduct',data)
    }
    async addproduct(req, res) {
      const data = req.body;
      let {productGender,productName,productPrice,productDescription,sale,productColor,productSize,brand,weight,quantitySold,isSpecial} = data;
      const newProductDescription = await textAreaSpace(productDescription);
      const newProductSize = await inputSpace(productSize);
      const numberOfClicks = 0; 
      const saleNumber = Number(sale);
      const productPriceNumber = Number(productPrice).toFixed(0);
      const productSalePrice = (productPriceNumber - (productPriceNumber * saleNumber) / 100).toFixed(0);
      if(isSpecial === "true")
          isSpecial = true;
      if(isSpecial === "false")
          isSpecial = false;
  
  
      const productImg = req.files.map(i=> {
        return `/img/Products/${i.originalname}`
      });
      const dataForSave = {
        productName,
        productGender,
        productPrice:productPriceNumber,
        productSalePrice,
        productDescription:newProductDescription,
        sale:saleNumber,
        productColor,
        brand,
        weight:Number(weight),
        productSize:newProductSize,
        numberOfClicks,
        quantitySold:quantitySold ? quantitySold : 0,
        productImg,
        isSpecial
      }
      console.log(dataForSave)
      
      ProductModel.create(dataForSave)
    
  
  
      res.json({isSuccess:true,message:"Thành công"});
    }
    // [ POST ] /admin/change-order-infor
    async changeOrderInfor(req,res) {
       const {name,phone,email,provinces,district,ward,detailAddress} = req.body;
  
   
      const userInfor = {
        name,
        phone,
        email,
        address: {
          provinces,
          district,
          ward,
          detailAddress
  
        }
  
      }
  
      try {
        // Update the product
          let productToUpdate = await OrderModel.findById(req.params.id);
  
          if (!productToUpdate) {
            throw new NotFoundError();
          }
  
          productToUpdate.set({userInfor:userInfor});
  
          await productToUpdate.save();
          res.redirect(`/admin/order-detail/${req.params.id}/${req.params.token}`)
      } catch (error) {
          console.log(error);
      }
      
  
    }
  
    async changeOrderStatus(req,res) {
        try {
          // Update the product
            let productToUpdate = await OrderModel.findById(req.params.id);
    
            if (!productToUpdate) {
              throw new NotFoundError();
            }
    
            productToUpdate.set({status:req.body.handle});
            await productToUpdate.save();
            return res.json({isSuccess:true,message:"Cập nhật thành công"})
        } catch (error) {
             console.log(error);
            return res.json({isSuccess:false,message:"Cập nhật thất bại"})
  
        }
    }
  
  
  }
  
  module.exports = new AuthCotroller();
  
} catch (error) {
    console.log(error);
}
