var express = require('express');
var router = express.Router();
var Product = require('../../models/Product');

router.get('/', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }
  console.log('GET');
  console.log('Types'+Types);
  var newProduct = new Product({
    Types : Types
   });
   newProduct.SpecificationDropdownList(function(err,SpecificationDropdownList){
     if(err){
       next(err);
     }else{
       console.log(SpecificationDropdownList);
   req.session.product = newProduct;
   res.render('Product/productDetail', {
    SpecificationList : SpecificationDropdownList,
    member : req.session.member || null
   });
 }})


});

router.post('/', function(req, res,next) {


 var newProduct = new Product({
   PName : req.body.PName,
   Specification : req.body.Specification,
   Types : req.body.Types,
   Supplier_Name : req.body.Supplier_Name
  });
  if(req.body.Specification == '---請選擇---' ){

    if(req.body.Types == '---請選擇---'){
      console.log('testA'+req.body.Types);
      newProduct.checkA(function(err,productList) {
        if(err) {
          next(err);
        } else {
          console.log('new'+newProduct);
          if(newProduct.PName !='')
          {
            newProduct.differentPName(function(err,PNameList){
              if(err){
                next(err);
              } else{
                if(newProduct.PName != ''){
                  newProduct.differentSpecification(function(err,SpecificationList){
                    if(err){
                      next(err);
                    }else{
                      newProduct.differentTypes(function(err,TypesList){
                        if(err){
                          next(err);
                        }else{
                              console.log(SpecificationDropdownList);
                          req.session.product = newProduct;
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
              req.session.product = null;
              //res.locals.used =used; //locals -> ejs
                res.render('Product/productDetail', {
                  PName : null,
                  member : req.session.member || null
                });
          }
        }
      });
    }else {
      newProduct.checkB(function(err,productList) {
          console.log('testB'+req.body.Types);
        if(err) {
          next(err);
        } else {
          console.log('new'+newProduct);

          if(newProduct.PName ||newProduct.Types!='')
          //||newProduct.Supplier_Name
          {
            newProduct.differentPName(function(err,PNameList){
              if(err){
                next(err);
              } else{
                if(newProduct.PName != ''){
                  newProduct.differentSpecification(function(err,SpecificationList){
                    if(err){
                      next(err);
                    }else{
                      newProduct.differentTypes(function(err,TypesList){
                        if(err){
                          next(err);
                        }else{
                          newProduct.SpecificationDropdownList(function(err,SpecificationDropdownList){
                            if(err){
                              next(err);
                            }else{
                              console.log(SpecificationDropdownList);
                          req.session.product = newProduct;
                          res.render('Product/productDetail', {
                             productList : productList,
                             PNameList : PNameList,
                             SpecificationList : SpecificationList,
                             TypesList : TypesList,
                             member : req.session.member || null
                          });
                        }})
                        }
                      })

                    }
                  })
                }
              }
            })
        } else {
              req.session.product = null;
              //res.locals.used =used; //locals -> ejs
                res.render('Product/productDetail', {
                  PName : null,
                  member : req.session.member || null
                });
          }
        }
      });
    }

    }
  else {
    if(req.body.Types == '---請選擇---'){
      newProduct.checkC(function(err,productList) {
          console.log('testC'+req.body.Types);
        if(err) {
          next(err);
        } else {
          console.log('new'+newProduct);

          if(newProduct.PName || newProduct.Specification !='')
          //||newProduct.Supplier_Name
          {
            newProduct.differentPName(function(err,PNameList){
              if(err){
                next(err);
              } else{
                if(newProduct.PName != ''){
                  newProduct.differentSpecification(function(err,SpecificationList){
                    if(err){
                      next(err);
                    }else{
                      newProduct.differentTypes(function(err,TypesList){
                        if(err){
                          next(err);
                        }else{
                          req.session.product = newProduct;
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
              req.session.product = null;
              //res.locals.used =used; //locals -> ejs
                res.render('Product/productDetail', {
                  PName : null,
                  member : req.session.member || null
                });

          }
        }
      });

    }else {
      newProduct.checkD(function(err,productList) {
        if(err) {
          next(err);
        } else {
          console.log('new'+newProduct);
          if(newProduct.PName || newProduct.Specification || newProduct.Types!='')
          //||newProduct.Supplier_Name
          {
            newProduct.differentPName(function(err,PNameList){
              if(err){
                next(err);
              } else{
                if(newProduct.PName != ''){
                  newProduct.differentSpecification(function(err,SpecificationList){
                    if(err){
                      next(err);
                    }else{
                      newProduct.differentTypes(function(err,TypesList){
                        if(err){
                          next(err);
                        }else{
                          req.session.product = newProduct;
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
              req.session.product = null;
              //res.locals.used =used; //locals -> ejs
                res.render('Product/productDetail', {
                  PName : null,
                  member : req.session.member || null
                });

          }
        }
      });
        console.log('testD'+req.body.Types);
    }


    }
  }

);

module.exports = router;
