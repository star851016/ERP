var express = require('express');
var router = express.Router();
var Purchase = require('../../models/Purchase');
router.get('/', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }

  res.render('Purchase/purchase', {
    purchase : req.session.purchase || null,
    member : req.session.member || null
  });
});
router.post('/', function(req, res,next) {
 var newPurchase = new Purchase({
   SName : req.body.SName,
   TPrice : req.body.TPrice,
   Status : req.body.Status,
  });
  newPurchase.savePurchase(function(err,Pur_Id) {
     if(err) {
         next(err);
     } else {
          console.log('savePurchase Finished');

          req.session.purchase = newPurchase;
          req.session.purchase2 = Pur_Id;
           console.log('req.session.purchase'+req.session.purchase);
           newPurchase.differentPName(function(err,PNameList){
             if(err){
               next(err);
             } else{
               req.session.PNameList = PNameList;
               if(newPurchase.PName != ''){
                 newPurchase.differentSpecification(function(err,SpecificationList){
                   if(err){
                     next(err);
                   }else{
                     req.session.SpecificationList = SpecificationList ;
                     newPurchase.differentTypes(function(err,TypesList){
                       if(err){
                         next(err);
                       }else{
                         req.session.TypesList = TypesList ;

                         res.render('Purchase/purchaseList', {
                           purchase : req.session.purchase || null,
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
