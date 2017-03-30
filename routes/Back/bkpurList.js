var express = require('express');
var router = express.Router();
var bkPurList = require('../../models/bkPurchase');
var async = require('async');


router.get('/', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }

  res.render('Back/bkpurchaseList', {
    bkpurchase : req.session.bkpurchase || null,
    bkpurchaseList : req.session.bkpurchaseList || null,
    member : req.session.member || null
  });
});

router.post('/', function(req, res,next) {

 var newbkpurList = new bkPurList({
   PName : req.body.bk_PName,
   Types : req.body.bk_Types,
   Specification : req.body.bk_Specification,
   Quantity : req.body.bk_Quantity,
   Price  : req.body.bk_Price,
   SubPrice : req.body.bkSubPrice,
    tableList : req.body.tableList
  });



       async.each(req.body.tableList, function(table, cb){
         //var window;
         if(req.body.bk_PName[table]!= ''){
           console.log('這列有打');
           console.log(req.body.bk_PName[table]);
           console.log(req.body.bk_Types[table]);
           console.log('找id');

           newbkpurList.findPro(table,function(err,productId) {
                if(err) {
                  console.log('bkpurchaseError');
                  res.render('Back/bkpurchaseError', {
                  bkpurchase : req.session.bkpurchase || null

                  });
                  next(err);
                } else {
                          req.session.bkpurList = newbkpurList;
                          req.session.bkpurProId = productId[0].id;
                          console.log('req.session.salesProId UPDATE前'+req.session.bkpurProId);
                          req.session.salesQ = productId[0].Quantity;
                          console.log('req.session.salesQ'+req.session.salesQ);
                          async.series([
                            function(done){
                              newbkpurList.updatebkPro(table,req.session.bkpurProId,req.session.salesQ,function(err) {
                                if(err) {
                                   next(err);
                                } else {
                                    req.session.bkpurList = newbkpurList;

                                }
                              })
                              done()
                            },function(done){
                              newbkpurList.savebkPurList(table,req.session.bkpurchase2,req.session.bkpurProId,function(err){
                                 if(err){
                                      next(err)
                                  }else{
                                      console.log('savebkPurList Finished');
                                      req.session.bkpurList = newbkpurList;
                                      res.render('Back/bkPurDetail', {
                                        bkpurchase : req.session.bkpurchase || null,
                                        bkpurList : req.session.bkpurList || null,
                                        member : req.session.member || null
                                      });
                                  }
                              })

                              done()
                            }
                          ])


                      }

      })
         }
       }),function(err){
         if(err) {
           res.status = err.code;
           next();
         } else {
           req.session.bkpurList = newbkpurList;
           res.render('Back/bkPurDetail', {
             bkpurchase : req.session.bkpurchase || null,
             bkpurList : req.session.bkpurList || null,
             member : req.session.member || null
           });
         }
       }


  });



  module.exports = router;
