var express = require('express');
var router = express.Router();
var bkSalesList = require('../../models/bkSales');
var async = require('async');


router.get('/', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }

  res.render('Back/bksalesList', {
    bksales : req.session.bksales || null,
    member : req.session.member || null
    //bkpurchaseList : req.session.bkpurchaseList || null
  });
});

router.post('/', function(req, res,next) {

 var newbksalesList = new bkSalesList({
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

           newbksalesList.findPro(table,function(err,productId) {
                if(err) {
                  console.log('bksalesError');
                  res.render('Back/bksalesError', {
                    bksales : req.session.bksales || null,
                    member : req.session.member || null

                  });
                  next(err);
                } else {
                          req.session.bksalesList = newbksalesList;
                          req.session.bksalesProId = productId[0].id;
                          console.log('req.session.bksalesProId UPDATE前'+req.session.bksalesProId);
                          req.session.salesQ = productId[0].Quantity;
                          console.log('req.session.salesQ'+req.session.salesQ);
                          async.series([
                            function(done){
                              newbksalesList.updatebkPro(table,req.session.bksalesProId,req.session.salesQ,function(err) {
                                if(err) {
                                   next(err);
                                } else {
                                    req.session.bksalesList = newbksalesList;

                                }
                              })
                              done()
                            },function(done){
                              newbksalesList.savebkSalesList(table,req.session.bksales2,req.session.bksalesProId,function(err){
                                 if(err){
                                      next(err)
                                  }else{
                                      console.log('savebkSalesList Finished');
                                      req.session.bksalesList = newbksalesList;
                                      res.render('Back/bksalesDetail', {
                                        bksales : req.session.bksales || null,
                                        bksalesList : req.session.bksalesList || null,
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
           req.session.bksalesList = newbksalesList;
           res.render('Back/bksalesDetail', {
             bksales : req.session.bksales || null,
             bksalesList : req.session.bksalesList || null
           });
         }
       }


  });



  module.exports = router;
