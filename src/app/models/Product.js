var mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

var ProductSchema = mongoose.Schema(
  {
    productId: mongoose.Types.ObjectId,
    productName: String,
    productPrice: Number,
    productSalePrice: Number,
    productDescription: [{type:Object}],
    productColor:String,
    productGender:String,
    productSize:[{type:String}],
    productImg:[{type:String}],
    url: String,
    weight:Number,
    sale:{
        type:Number,
        default:0,
    },
    isSpecial: {type:Boolean, default:false},
    isAvailable:{type:Boolean, default:true},
    quantitySold:Number,
    numberOfClicks:Number,
    brand:String,
    
    slug: { type: String, slug: `productName`, unique: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Product', ProductSchema);
