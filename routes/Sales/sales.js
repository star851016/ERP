var express = require('express');
var router = express.Router();
var Sales = require('../../models/Sales');
router.get('/', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }

  res.render('Sales/sales', {
    sales : req.session.sales || null,
    member : req.session.member || null
  });
});
router.post('/', function(req, res,next) {
  console.log('req.body.CName'+req.body.CName);
 var newSales = new Sales({
   CName : req.body.CName,
   TSales : req.body.TSales,
   Status : req.body.Status,
  });
  newSales.saveSales(function(err,Sales_Id) {
     if(err) {
         next(err);
     } else {
          console.log('saveSales Finished');

          req.session.sales = newSales;
          req.session.sales_ID = Sales_Id;
          newSales.differentPName(function(err,PNameList){
            if(err){
              next(err);
            } else{
              req.session.PNameList = PNameList;
              if(newSales.PName != ''){
                newSales.differentSpecification(function(err,SpecificationList){
                  if(err){
                    next(err);
                  }else{
                    req.session.SpecificationList = SpecificationList ;
                    newSales.differentTypes(function(err,TypesList){
                      if(err){
                        next(err);
                      }else{
                        req.session.TypesList = TypesList ;

                        res.render('Sales/salesList', {
                          sales : req.session.sales || null,
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
