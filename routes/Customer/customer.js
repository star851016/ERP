var express = require('express');
var router = express.Router();
var Customer = require('../../models/Customer');

router.get('/', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }
  var newCustomer = new Customer({
      ID : req.body.ID,
      CName: req.body.CName,
      Tell1: req.body.Tell1,
      UniformNum: req.body.UniformNum

  });
  newCustomer.get(function(err,CustomerList){
    newCustomer.getCName(function(err,CNameList){

      res.render('Customer/customerDetail', {
        cNameList : CNameList,
        customerList : CustomerList,
        member : req.session.member || null
      });
    })

  });

});

//查詢
router.post('/', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }
  var newCustomer = new Customer({
      ID : req.body.ID,
      CName: req.body.CName,
      Tell1: req.body.Tell1,
      UniformNum: req.body.UniformNum

  });
  newCustomer.find(function(err,CustomerList){
    newCustomer.getCName(function(err,CNameList){

      res.render('Customer/customerDetail', {
        cNameList : CNameList,
        customerList : CustomerList,
        member : req.session.member || null
      });
    })

  });

});
module.exports = router;
