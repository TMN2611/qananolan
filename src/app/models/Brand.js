var mongoose = require('mongoose');


var BrandSchema = mongoose.Schema(
  {
    brandId: mongoose.Types.ObjectId,
    brandName: String,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Brand', BrandSchema);
