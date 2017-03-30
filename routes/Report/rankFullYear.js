var express = require('express');
var router = express.Router();
var RankFullYear = require('../../models/Report');


var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.session.member) {
    res.redirect('/');
  }
  res.render('DashBoard/rankFullYear', {
    RankFullYear : null,
    member : req.session.member || null
  });
});

router.post('/', function(req, res, next) {

  var newRankFullYear = new RankFullYear();

  newRankFullYear.findSupplier(function(err,SupplierList){
    if(err) {
        next(err);
      } else {
        console.log('SupplierList'+SupplierList);
        res.render('DashBoard/rankFullYear', {
            SupplierList : SupplierList,
            member : req.session.member || null
        });
      }
  });






});




module.exports = router;
