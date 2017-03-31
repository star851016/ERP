var express = require('express');
var router = express.Router();
var bkSales = require('../../models/bkSales');
router.get('/', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }

  res.render('Back/bksales', {
    bksales : req.session.bksales || null,
    member : req.session.member || null
  });
});
router.post('/', function(req, res,next) {
  console.log('req.body.CName'+req.body.CName);
 var newbkSales = new bkSales({
   CName : req.body.CName,
   TSales : req.body.TSales,
   Status : req.body.Status,
  });
  newbkSales.savebkSales(function(err,bkSales_Id) {
     if(err) {
         next(err);
     } else {
          console.log('savebkSales Finished');

          req.session.bksales = newbkSales;
          req.session.bksales2 = bkSales_Id;
           console.log('req.session.bksales'+req.session.bksales);
           newbkSales.differentPName(function(err,PNameList){
             if(err){
               next(err);
             } else{
               req.session.PNameList = PNameList;
               if(newbkSales.PName != ''){
                 newbkSales.differentSpecification(function(err,SpecificationList){
                   if(err){
                     next(err);
                   }else{
                     req.session.SpecificationList = SpecificationList ;
                     newbkSales.differentTypes(function(err,TypesList){
                       if(err){
                         next(err);
                       }else{
                         req.session.TypesList = TypesList ;

                         res.render('Back/bksalesList', {
                           bksales : req.session.bksales || null,
                           purchaseList : req.session.purchaseList || null,
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

     }
   })
});
module.exports = router;
