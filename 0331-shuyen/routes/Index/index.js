var express = require('express');
var router = express.Router();
var Member = require('../../models/Member');


/* GET home page. */

  router.get('/', function(req, res, next) {
    res.render('Shared/index',
      {
        member : req.session.member || null
      });

  });


module.exports = router;
