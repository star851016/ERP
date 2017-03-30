var express = require('express');
var router = express.Router();
var Product = require('../../models/Product');

router.get('/', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }
  res.render('productDetail', {
    productList : req.session.product || null,
    member : req.session.member || null

  });
});
//未設條件的查詢
router.post('/', function(req, res,next) {

 var newProduct = new Product({
   PName : req.body.PName,
   Specification : req.body.Specification,
   Types : req.body.Types,
   Supplier_Name : req.body.Supplier_Name
  });
  console.log('req.body.PName'+req.body.PName);
  newProduct.check(function(err,productList) {
    if(err) {
      next(err);
    } else {
      if(newProduct.PName !='')
      {
        newProduct.differentPName(function(err,PNameList){
          if(err){
            next(err);
          } else{
            req.session.PNameList = PNameList;
            if(newProduct.PName != ''){
              newProduct.differentSpecification(function(err,SpecificationList){
                if(err){
                  next(err);
                }else{
                  req.session.SpecificationList = SpecificationList ;
                  newProduct.differentTypes(function(err,TypesList){
                    if(err){
                      next(err);
                    }else{
                      req.session.TypesList = TypesList ;
                      req.session.product = newProduct;
                      res.render('Product/productDetail', {
                         productList : productList,
                         PNameList : req.session.PNameList,
                         SpecificationList : req.session.SpecificationList,
                         TypesList : req.session.TypesList,
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
          req.session.product = null;
            res.render('product', {
              PName : null,
              member : req.session.member || null
            });
      }
    }
  });
});


module.exports = router;
