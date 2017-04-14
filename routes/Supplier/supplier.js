var express = require('express');
var router = express.Router();
var Supplier = require('../../models/Supplier');
var UpSupplier = require('../../models/Supplier');
var Update = require('../../models/Supplier');
var DelSupplier = require('../../models/Supplier');
var Delete = require('../../models/Supplier');



router.get('/', function(req, res,next) {
 var newSupplier = new Supplier({
   SName : req.body.SName,
   Phones : req.body.Phone,
   Contact_Person : req.body.Contact_Person
  });
  newSupplier.check(function(err,supplierList) {
    if(err) {
      next(err);
    } else {
      console.log('supplierList'+supplierList[0].SName);
        console.log('supplierList'+supplierList[1].SName);
          console.log('supplierList'+supplierList[1].Phone);
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
//編輯點進去 去find 該列的資料
router.post('/upSupplier', function(req, res,next) {
  console.log('req'+req.body.id);
  console.log('upSupplier');
 var newUpSupplier = new UpSupplier({
   id : req.body.id
  });
  console.log(req.body.id);
  newUpSupplier.find(function(err,upSupplier) {

    if(err) {
      next(err);
    } else {
      if(newUpSupplier.id!='')
      {
        console.log('upSupplier.SName'+upSupplier.SName);
        req.session.upSupplier = newUpSupplier;
        res.render('Supplier/upSupplier', {
          upSupplier : req.session.upSupplier || null
          });
    } else {
          req.session.upSupplier = null;
            res.render('Supplier/upSupplier', {
              SName : null
            });
      }
    }
  });
});
//確定要 update
router.post('/update', function(req, res,next) {
 var newUpdate = new Update({
   id : req.body.id,
   SName : req.body.SName,
   Phone : req.body.Phone,
   Contact_Person : req.body.Contact_Person
  });
          newUpdate.update(function(err) {
            console.log('update');
            if(err) {
              next(err);
            } else {
               if(newUpdate.SName!='')
              {
                newUpdate.check(function(err,supplierList) {
                  console.log('check');
                  if(err) {
                    next(err);
                  } else {
                    if(newUpdate.SName !='')
                    {
                    req.session.update = newUpdate;
                    res.render('Supplier/supplierDetail', {
                       supplierList : supplierList
                    });
                  } else {
                        req.session.update = null;
                          res.render('Supplier/supplierDetail', {
                            SName : null
                          });
                    }
                  }
                });
            } else {
                  req.session.update = null;
              }
            }
          });



});
//點刪除 要find資料
router.post('/delSupplier', function(req, res,next) {
 var newDelSupplier = new DelSupplier({
   id : req.body.id
  });
  newDelSupplier.find(function(err,delSupplier) {

    if(err) {
      next(err);
    } else {
      if(newDelSupplier.id!='')
      {
        req.session.delSupplier = newDelSupplier;
        res.render('Supplier/delSupplier', {
        delSupplier : req.session.delSupplier || null
        });
    } else {
      req.session.delSupplier = newDelSupplier;
      res.render('Supplier/delSupplier', {
      delSupplier :  null
      });
      }
    }
  });

});

router.post('/delete', function(req, res,next) {
  console.log('req.body.id'+req.body.id);
 var newDelete = new Delete({
    id : req.body.id,
   SName : req.body.SName,
   Phone : req.body.Phone,
   Contact_Person : req.body.Contact_Person
  });
  newDelete.del(function(err) {
    if(err) {
      next(err);
    } else {
      if(newDelete.SName!='')
      {
        newDelete.check(function(err,supplierList) {
          console.log('check');
          if(err) {
            next(err);
          } else {
            if(newDelete.SName !='')
            {
            req.session.delete = newDelete;
            res.render('Supplier/supplierDetail', {
               supplierList : supplierList

            });
          } else {
                req.session.delete = null;
                  res.render('Supplier/supplierDetail', {
                    SName : null
                  });
            }
          }
        });
    } else {
          req.session.delete = null;
            res.render('Supplier/supplierDetail', {
              SName : null
            });
      }
    }
  });
});

module.exports = router;
