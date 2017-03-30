var express = require('express');
var router = express.Router();
var Supplier = require('../../models/Supplier');

router.get('/', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }
  res.render('Supplier/supplierDetail', {
    supplier : req.session.supplier || null,
    member : req.session.member || null
  });
});
router.post('/', function(req, res,next) {
 var newSupplier = new Supplier({
   SName : req.body.SName,
   Phones : req.body.Phone,
   Contact_Person : req.body.Contact_Person
  });
  newSupplier.get(function(err,supplierList) {
    if(err) {
      next(err);
    } else {
      if(newSupplier.SName!='')
      {
      res.render('Supplier/supplierDetail', {
        supplierList : supplierList,
        member : req.session.member || null
      });
    } else {
            res.render('Supplier/supplierDetail', {
              SName : null,
              member : req.session.member || null
            });

      }
    }
  });
});
module.exports = router;
