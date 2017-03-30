var express = require('express');
var router = express.Router();
var AddProduct = require('../../models/Product');

router.get('/', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }
  res.render('Product/addProduct', {
    addProduct : req.session.addProduct || null,
    member : req.session.member || null
  });
});

router.post('/', function(req, res,next) {
  console.log('addProduct');
 var newAddProduct = new AddProduct({
   PName : req.body.PName,
   Types : req.body.Types,
   Specification : req.body.Specification,
   SafeQuantity : req.body.SafeQuantity,
   Sales_Price : req.body.Sales_Price
  });
  newAddProduct.save(function(err) {
    console.log('save'+req.body.PName);
    if(err) {
      next(err);
    } else {
      if(newAddProduct.PName!='')
      {
        console.log('new'+newAddProduct);
        req.session.addProduct = newAddProduct;
        res.render('Product/addPDetail', {
          addProduct : req.session.addProduct || null,
          member : req.session.member || null
          });
    } else {
          req.session.addProduct = null;
            res.render('Product/addProduct', {
              PName : null,
              member : req.session.member || null
            });

      }

    }
  });
});


module.exports = router;
