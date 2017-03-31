var express = require('express');
var router = express.Router();
var PurchaseList = require('../../models/Purchase');
var async = require('async');

router.get('/', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }

  res.render('Purchase/purchaseList', {
    purchase : req.session.purchase || null,
    purchaseList : req.session.purchaseList || null,
    member : req.session.member || null
  });
});

router.post('/', function(req, res,next) {

 var newPurchaseList = new PurchaseList({
   PName : req.body.Pur_PName,
   Types : req.body.Pur_Types,
   Specification : req.body.Pur_Specification,
   Quantity : req.body.Pur_Quantity,
   Price  : req.body.Pur_Price,
   SubPrice : req.body.SubPrice,
    tableList : req.body.tableList
  });



       async.each(req.body.tableList, function(table, cb){
         if(req.body.Pur_PName[table]!= ''){
           console.log('這列有打');
           console.log(req.body.Pur_PName[table]);
           console.log(req.body.Pur_Types[table]);
           console.log('找id');
           console.log('新增或更新');
           newPurchaseList.findPro(table,function(err,productId) {
                if(err) {
                  req.session.purchaseList = newPurchaseList;
                  res.render('Purchase/purchaseDetail', {
                  purchase : req.session.purchase || null,
                  purchaseList : req.session.purchaseList || null,
                  member : req.session.member || null
                  });
                        newPurchaseList.savePro(table,function(err,saveProId) {
                                  if(err) {
                                     next(err);
                                  } else {
                                    req.session.saveProId = saveProId;
                                    console.log('req.session.saveProId'+req.session.saveProId);
                                    newPurchaseList.savePurList(table,req.session.purchase2,req.session.saveProId,function(err){
                                       if(err){
                                            next(err)
                                        }else{

                                            console.log('savePurList Finished');

                                        }
                                    })
                                }
                             });
                } else {
                  req.session.purchaseList = newPurchaseList;
                  res.render('Purchase/purchaseDetail', {
                  purchase : req.session.purchase || null,
                  purchaseList : req.session.purchaseList || null,
                  member : req.session.member || null
                  });

                      if(productId[0].id!=''){
                          req.session.purchaseList = newPurchaseList;
                          req.session.purchaseProId= productId[0].id;
                          console.log('req.session.purchaseProId UPDATE前'+req.session.purchaseProId);
                          req.session.purchaseQ = productId[0].Quantity;
                          async.series([
                            function(done){
                              newPurchaseList.updatePro(table,req.session.purchaseProId,req.session.purchaseQ,function(err) {
                                if(err) {
                                   next(err);
                                } else {
                                    req.session.purchaseList = newPurchaseList;
                                    console.log('req.session.purchaseProId 新增進貨明細前'+req.session.purchaseProId);

                                }
                              })
                              done()
                            },function(done){
                              newPurchaseList.savePurList(table,req.session.purchase2,req.session.purchaseProId,function(err){
                                 if(err){
                                      next(err)
                                  }else{
                                      console.log('savePurList Finished');

                                      console.log('req.session.purchaseList'+req.session.purchaseList);

                                  }
                              })

                              done()
                            }
                          ])

                        }else{

                          }
                      }

      })
         }
       }),function(err){
         if(err) {
           res.status = err.code;
           next();
         } else {
           req.session.purchaseList = newPurchaseList;
           res.render('Purchase/purchaseDetail', {
             purchase : req.session.purchase || null,
           purchaseList : req.session.purchaseList || null,
           member : req.session.member || null
           });
         }
       }


  });



  module.exports = router;
