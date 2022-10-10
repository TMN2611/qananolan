var mongoose = require('mongoose');


var ProductSchema = mongoose.Schema(
  {
    productId: mongoose.Types.ObjectId,
    productName: String,
    productPrice: Number,
    productSalePrice: Number,
    productDescription: [{type:Object}],
    productColor:String,
    productGender:String,
    productSize:[{type:Number}],
    url: String,
    weight:Number,
    sale:{
        type:Number,
        default:0,
    },
    isSpecial: Boolean,
    quantitySold:Number,
    numberOfClicks:Number,
    brand:String,
    slug: { type: String, slug: `productName`, unique: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Product', ProductSchema);
