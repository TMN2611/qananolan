var mongoose = require('mongoose');


var UserSchema = mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    phone: Number,
    password:String,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('User', UserSchema);
