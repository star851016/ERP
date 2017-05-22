var express = require('express');
var router = express.Router();
var Accounting = require('../../models/Report');
var fecha = require('fecha');
var dateFormat = require('dateformat');

router.get('/', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }
  var newAccounting = new Accounting({
    SName : req.body.SName,
    Phones : req.body.Phone,
    Contact_Person : req.body.Contact_Person
   });
  newAccounting.checkAllWorklist(function(err,worklist){
     if(err){
        next(err);
     }else{
       console.log('worklist[0].OutDate'+worklist[0].OutDate);
       for(i=0;i<worklist.length;i++){
         console.log(i);
          worklist[i].OutDate = fecha.format(worklist[i].OutDate, 'YYYY-MM-DD');
         };

       res.render('Accounting/operation', {
         worklist : worklist,
         member : req.session.member || null
       });
      }
   });

});

router.post('/findWorklist', function(req, res) {
  if(!req.session.member) {
  //  res.redirect('/');
  }
  var newAccounting = new Accounting({
    fromTime : req.body.fromTime,
    toTime : req.body.toTime
   });
   console.log('req.body.fromTime'+req.body.fromTime);
  newAccounting.checkTimeWorklist(req.body.fromTime,req.body.toTime,function(err,worklist){
     if(err){
        next(err);
     }else{
       console.log('worklist[0].OutDate'+worklist[0].OutDate);
       for(i=0;i<worklist.length;i++){
         console.log(i);
          worklist[i].OutDate = fecha.format(worklist[i].OutDate, 'YYYY-MM-DD');
         };

       res.render('Accounting/operation', {
         worklist : worklist,
         member : req.session.member || null
       });
      }
   });

});

module.exports = dateFormat;
module.exports = router;
