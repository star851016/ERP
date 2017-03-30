var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }
  res.render('Shared/home1', {
    member : req.session.member || null
  });
});

module.exports = router;
