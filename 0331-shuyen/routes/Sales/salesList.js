var express = require('express');
var router = express.Router();
var SalesList = require('../../models/Sales');
var async = require('async');


router.get('/', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }

  res.render('Sales/salesList', {
    sales : req.session.sales || null,
    salesList : req.session.salesList || null,
    member : req.session.member || null
  });
});

router.post('/', function(req, res,next) {

 var newSalesList = new SalesList({
   PName : req.body.Sales_PName,
   Types : req.body.Sales_Types,
   Specification : req.body.Sales_Specification,
   Quantity : req.body.Sales_Quantity,
   Price  : req.body.Sales_Price,
   SubPrice : req.body.SubPrice,
    tableList : req.body.tableList
  });



       async.each(req.body.tableList, function(table, cb){
         var window;
         if(req.body.Sales_PName[table]!= ''){
           console.log('這列有打');
           console.log(req.body.Sales_PName[table]);
           console.log(req.body.Sales_Types[table]);
           console.log('找id');
           console.log('更新');
           newSalesList.findPro(table,function(err,productId) {
                if(err) {
                  console.log('salesError');
                  res.render('Sales/salesError', {
                    sales : req.session.sales || null,
                    member : req.session.member || null

                  });

                } else {
                          req.session.salesProId= productId[0].id;
                          console.log('req.session.salesProId UPDATE前'+req.session.salesProId);
                          req.session.salesQ = productId[0].Quantity;
                          async.series([
                            function(done){
                              newSalesList.updatePro(table,req.session.salesProId,req.session.salesQ,function(err) {
                                if(err) {
                                   next(err);
                                } else {
                                    req.session.salesList = newSalesList;

                                }
                              })
                              done()
                            },function(done){
                              newSalesList.saveSalesList(table,req.session.sales_ID,req.session.salesProId,function(err){
                                 if(err){
                                      next(err)
                                  }else{
                                      console.log('saveSalesList Finished');
                                      req.session.salesList = newSalesList;
                                      res.render('Sales/salesDetail', {
                                        sales : req.session.sales || null,
                                        salesList : req.session.salesList || null,
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
           res.render('Sales/salesError', {
             sales : req.session.sales || null,
             member : req.session.member || null

           });

         }
       }


  });



  module.exports = router;
