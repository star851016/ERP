var express = require('express');
var router = express.Router();
var bkPurchase = require('../../models/bkPurchase');
router.get('/', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }

  res.render('Back/bkpurchase', {
    bkpurchase : req.session.bkpurchase || null,
      member : req.session.member || null
  });
});
router.post('/', function(req, res,next) {
 var newbkPurchase = new bkPurchase({
   SName : req.body.SName,
   TPrice : req.body.TPrice,
   Status : req.body.Status,
  });
  newbkPurchase.savebkPurchase(function(err,bkPur_Id) {
     if(err) {
         next(err);
     } else {
          console.log('savebkPurchase Finished');

          req.session.bkpurchase = newbkPurchase;
          req.session.bkpurchase2 = bkPur_Id;
           console.log('req.session.bkpurchase'+req.session.bkpurchase);
           newbkPurchase.differentPName(function(err,PNameList){
             if(err){
               next(err);
             } else{
               req.session.PNameList = PNameList;
               if(newbkPurchase.PName != ''){
                 newbkPurchase.differentSpecification(function(err,SpecificationList){
                   if(err){
                     next(err);
                   }else{
                     req.session.SpecificationList = SpecificationList ;
                     newbkPurchase.differentTypes(function(err,TypesList){
                       if(err){
                         next(err);
                       }else{
                         req.session.TypesList = TypesList ;

                         res.render('Back/bkpurchaseList', {
                           bkpurchase : req.session.bkpurchase || null,
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
