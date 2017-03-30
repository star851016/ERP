var express = require('express');
var router = express.Router();
var Sup = require('../../models/Supplier');

router.get('/', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }
  res.render('Supplier/sup', {
    sup : req.session.sup || null,
    member : req.session.member || null
  });
});

router.post('/', function(req, res,next) {
  console.log('req.body.Person'+req.body.Contact_Person);
 var newSup = new Sup({
   SName : req.body.SName,
   Phone : req.body.Phone,
   Contact_Person : req.body.Contact_Person
  });
  newSup.save(function(err) {
    console.log('Sup'+req.body.SName);
    if(err) {
      next(err);
    } else {
      console.log('new'+newSup);

      if(newSup.SName!='')
      {
      req.session.sup = newSup;
      res.render('Supplier/supDetail', {
        sup : req.session.sup || null,
        member : req.session.member || null
      });
    } else {
          req.session.sup = null;
            res.render('Supplier/supDetail', {
              SName : null,
              member : req.session.member || null
            });

      }
    }
  });
});


module.exports = router;
