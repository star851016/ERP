var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }

  res.render('Customer/addCustomer', {

    member : req.session.member || null
  });
});
module.exports = router;
