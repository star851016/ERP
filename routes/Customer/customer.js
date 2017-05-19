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
      req.session.CNameList = CNameList;
      res.render('Customer/customerDetail', {
        cNameList : req.session.CNameList,
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

      res.render('Customer/customerDetail', {
        cNameList : req.session.CNameList,
        customerList : CustomerList,
        member : req.session.member || null
      });


  });

});

//新增客戶
router.post('/addCustomer', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }
  var newCustomer = new Customer({
      CarId : req.body.CarId,
      CName: req.body.CName,
      BrandID : req.body.BrandID,
      TypeID : req.body.TypeID,
      cc : req.body.cc,
      CarBodyNum : req.body.CarBodyNum,
      YrOfManu : req.body.YrOfManu,
      Contact_Person : req.body.Contact_Person,
      Tell1: req.body.Tell1,
      Tell2: req.body.Tell2,
      CBirthDate : req.body.CBirthDate,
      Addr : req.body.Addr,
      UniformNum: req.body.UniformNum

  });
  newCustomer.saveCustomer(function(err,ID){
    console.log('ID'+ID);
    newCustomer.saveCar(ID,function(err){
      res.redirect('/customer');
    })



  });

});
module.exports = router;
