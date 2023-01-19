var mongoose = require('mongoose');


var BrandSchema = mongoose.Schema(
  {
    isAvailable: Boolean,
    discountName: String,
    decrease: Number,
    condition:String,
    unit:String,
    type:String,
    minOrderPrice:Number,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Discount', BrandSchema);
