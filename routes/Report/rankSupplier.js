var express = require('express');
var router = express.Router();
var RankSupplier = require('../../models/Report');


var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.session.member) {
    res.redirect('/');
  }
  res.render('DashBoard/rankSupplier', {
    rankSupplier : null,
    member : req.session.member || null
  });
});

router.post('/', function(req, res, next) {
  console.log('StartTime'+req.body.StartTime);
  console.log('EndTime'+req.body.EndTime);

  var newRankSupplier = new RankSupplier({
    StartTime : req.body.StartTime,
    EndTime : req.body.EndTime
  });

var StartTime = req.body.StartTime+' '+'00:00:00'
var EndTime = req.body.EndTime+' '+'23:59:59'
var StartDate = req.body.StartTime;
var EndDate = req.body.EndTime;
req.session.StartTime = StartDate;
req.session.EndTime = EndDate;

  newRankSupplier.rankSupplier(StartTime,EndTime,function(err,rankList) {

    if(err) {
      next(err);
    } else {
      console.log('rankList'+rankList);
      res.render('DashBoard/rankSupDetail', {
          StartTime : req.session.StartTime || null,
          EndTime : req.session.EndTime || null,
          rankList : rankList,
          member : req.session.member || null
      });
    }
  });


});




module.exports = router;
