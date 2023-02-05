const BrandModel = require("../models/Brand");
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { getProducts } = require('../../util/getDataFromDB')
var jwt = require('jsonwebtoken');


class AdminCotroller {
  //  [GET]  / admin/login
  async login(req, res) {
        res.render('admin/login',{layout:false})
  }
  // [ POST ] / admin/handle-login
  async handleLogin (req, res) {

  }
  //  [GET]  / admin/signup
  async signup(req, res) {
        res.render('admin/signup',{layout:false})
  }
  // [ POST ] / admin/handle-signup
  async handleSignup (req, res) {

  }

 
}

module.exports = new AdminCotroller();
