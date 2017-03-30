var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }
  res.render('DashBoard/purSalesReport', {
    sumPurchaseA : req.session.sumPurchaseA,
    sumPurchaseB : req.session.sumPurchaseB,
    sumPurchaseC : req.session.sumPurchaseC,
    sumPurchaseD : req.session.sumPurchaseD,
    sumPurchaseE : req.session.sumPurchaseE,
    sumSalesA : req.session.sumSalesA,
    sumSalesB : req.session.sumSalesB,
    sumSalesC : req.session.sumSalesC,
    sumSalesD : req.session.sumSalesD,
    sumSalesE : req.session.sumSalesE,
    member : req.session.member || null
  });
});

module.exports = router;
