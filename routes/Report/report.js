var express = require('express');
var router = express.Router();
var Report = require('../../models/Report');


var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.session.member) {
    //res.redirect('/');
  }
  res.render('DashBoard/reportPurchase', {
    report : null,
    member : req.session.member || null
  });
});

router.post('/', function(req, res, next) {
  console.log('StartTime'+req.body.StartTime);
  console.log('EndTime'+req.body.EndTime);

  var newReport = new Report({
    StartTime : req.body.StartTime,
    EndTime : req.body.EndTime
  });

var StartTime = req.body.StartTime+' '+'00:00:00'
var EndTime = req.body.EndTime+' '+'23:59:59'
var StartDate = req.body.StartTime;
var EndDate = req.body.EndTime;
req.session.StartTime = StartDate;
req.session.EndTime = EndDate;

  newReport.checkPurchase(StartTime,EndTime,function(err,checkPurchase) {

    if(err) {
      next(err);
    } else {
      console.log('checkPurchase'+checkPurchase);
      res.render('DashBoard/reportPurDetail', {
          StartTime : req.session.StartTime || null,
          EndTime : req.session.EndTime || null,
         checkPurchase : checkPurchase,
         member : req.session.member || null
      });
    }
  });
});
router.post('/dashboard', function(req, res, next) {
  console.log('dashboard');
  var newReport = new Report();

  newReport.checkTodayPur(function(err,checkPurchase) {

    if(err) {
      next(err);
    } else {
      console.log('checkPurchase'+checkPurchase);

      res.render('DashBoard/reportPurDetail', {
         checkPurchase : checkPurchase,
         member : req.session.member || null
      });
    }
  });




});




module.exports = router;
