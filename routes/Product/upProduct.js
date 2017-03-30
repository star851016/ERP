var express = require('express');
var router = express.Router();
var UpProduct = require('../../models/Product');
var Update = require('../../models/Product');


router.get('/', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }
  res.render('Product/upProduct', {
    upProduct : req.session.upProduct || null,
    member : req.session.member || null
  });
});

router.post('/', function(req, res,next) {
  console.log('req'+req.body.id);
  console.log('upProduct');
 var newUpProduct = new UpProduct({
   id : req.body.id
  });
  console.log(req.body.id);
  newUpProduct.find(function(err,upProduct) {

    if(err) {
      next(err);
    } else {
      if(newUpProduct.id!='')
      {
        newUpProduct.differentPName(function(err,PNameList){
          if(err){
            next(err);
          } else{
            if(newUpProduct.PName != ''){
              newUpProduct.differentSpecification(function(err,SpecificationList){
                if(err){
                  next(err);
                }else{
                  newUpProduct.differentTypes(function(err,TypesList){
                    if(err){
                      next(err);
                    }else{
                      req.session.upProduct = newUpProduct;
                      //console.log('upProduct'+upProduct.PName);
                      res.render('Product/upProduct', {
                        upProduct : req.session.upProduct || null,
                         PNameList : PNameList,
                         SpecificationList : SpecificationList,
                         TypesList : TypesList,
                         member : req.session.member || null
                      });
                    }
                  })

                }
              })
            }
          }
        })

    } else {
          req.session.upProduct = null;
            res.render('Product/upProduct', {
              PName : null
            });
      }
    }
  });
});

router.post('/update', function(req, res,next) {
 var newUpdate = new Update({
   id : req.body.id,
   PName : req.body.PName,
   Types : req.body.Types,
   Specification : req.body.Specification,
   Quantity : req.body.Quantity
  });
          newUpdate.update(function(err) {
            console.log('change');
            if(err) {
              next(err);
            } else {
               if(newUpdate.Name!='')
              {
                newUpdate.check(function(err,productList) {
                  console.log('check');
                  if(err) {
                    next(err);
                  } else {
                    if(newUpdate.PName !='')
                    {
                      newUpdate.differentPName(function(err,PNameList){
                        if(err){
                          next(err);
                        } else{
                          if(newUpdate.PName != ''){
                            newUpdate.differentSpecification(function(err,SpecificationList){
                              if(err){
                                next(err);
                              }else{
                                newUpdate.differentTypes(function(err,TypesList){
                                  if(err){
                                    next(err);
                                  }else{
                                    req.session.update = newUpdate;
                                    res.render('Product/productDetail', {
                                      productList : productList,
                                       PNameList : PNameList,
                                       SpecificationList : SpecificationList,
                                       TypesList : TypesList,
                                       member : req.session.member || null
                                    });
                                  }
                                })

                              }
                            })
                          }
                        }
                      })

                  } else {
                        req.session.update = null;
                          res.render('Product/productDetail', {
                            PName : null
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

module.exports = router;
