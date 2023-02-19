const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const fs = require('fs');

async function readFile() {

  
   
    return data
}


class PolicyCotroller {
  //  [GET]  / policy/introduce
  async introduce(req, res) {

     res.render('policy/introduce')
  }
  //  [GET]  / policy/sizeguide
  async sizeguide(req, res) {
    
    res.render('policy/sizeguide')
    
  }
  //  [GET]  / policy/payment
  async payment(req, res) {
    
    res.render('policy/payment')
    
  }
  //  [GET]  / policy/replacement
  async replacement(req, res) {
    
    res.render('policy/replacement')
    
  }
  //  [GET]  / policy/security
  async security(req, res) {
    
    res.render('policy/security')
    
  }
  //  [GET]  / policy/shipment
  async shipment(req, res) {
    
    res.render('policy/shipment')
    
  }
  
}

module.exports = new PolicyCotroller();
