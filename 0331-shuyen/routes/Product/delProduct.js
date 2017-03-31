var express = require('express');
var router = express.Router();
var DelProduct = require('../../models/Product');

router.get('/', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }
  res.render('Product/delProduct', {
    delProduct : req.session.delProduct || null,
    member : req.session.member || null

  });
});

router.post('/', function(req, res,next) {
 var newDelProduct = new DelProduct({
   id : req.body.id
  });
  newDelProduct.find(function(err,delProduct) {

    if(err) {
      next(err);
    } else {
      if(newDelProduct.id!='')
      {
        req.session.delProduct = newDelProduct;
          res.render('Product/delProduct', {
          delProduct : req.session.delProduct || null,
          member : req.session.member || null
          });

    } else {
      req.session.delProduct = newDelProduct;
      res.render('Product/delProduct', {
      delProduct :  null,
      member : req.session.member || null
      });
      }
    }
  });

});

router.post('/delete', function(req, res,next) {
  console.log('req.body.id'+req.body.id);
 var newDelProduct = new DelProduct({
    id : req.body.id,
   PName : req.body.PName,
   Types : req.body.Types,
   Specification : req.body.Specification,
   Quantity : req.body.Quantity
  });
  newDelProduct.delete(function(err) {
    if(err) {
      next(err);
    } else {
      if(newDelProduct.PName!='')
      {
        //console.log('new'+newDelProduct);
        newDelProduct.check(function(err,productList) {
          console.log('check');
          if(err) {
            next(err);
          } else {
            if(newDelProduct.PName !='')
            {
              newDelProduct.differentPName(function(err,PNameList){
                if(err){
                  next(err);
                } else{
                  if(newDelProduct.PName != ''){
                    newDelProduct.differentSpecification(function(err,SpecificationList){
                      if(err){
                        next(err);
                      }else{
                        newDelProduct.differentTypes(function(err,TypesList){
                          if(err){
                            next(err);
                          }else{
                            req.session.delproduct = newDelProduct;
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
                req.session.delProduct = null;
                  res.render('Product/productDetail', {
                    PName : null,
                    member : req.session.member || null
                  });
            }
          }
        });
    } else {
          req.session.delProduct = null;
            res.render('Product/productDetail', {
              PName : null,
              member : req.session.member || null
            });
      }
    }
  });
});


module.exports = router;
