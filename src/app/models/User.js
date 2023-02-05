var mongoose = require('mongoose');


var UserSchema = mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    userName: String,
    password:String,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('User', UserSchema);
