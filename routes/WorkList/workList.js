var express = require('express');
var router = express.Router();
var Worklist = require('../../models/Worklist');
var UpWorklist = require('../../models/Worklist');
var SearchPId = require('../../models/Worklist');
var Update = require('../../models/Worklist');
var DelWorklist = require('../../models/Worklist');
var Delete = require('../../models/Worklist');
var SaveMat = require('../../models/Worklist');

var dateFormat = require('dateformat');
var fecha = require('fecha');
var async = require('async');


router.get('/', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }
  var newWorklist = new Worklist({
    SName : req.body.SName,
    Phones : req.body.Phone,
    Contact_Person : req.body.Contact_Person
   });

     newWorklist.WorkList(function(err,worklist){
        if(err){
           next(err);
        }else{
        res.render('WorkList/workList', {
            worklist : worklist,
            member : req.session.member || null
          });
         }
      });
});

router.post('/', function(req, res,next) {
 var newWorklist = new Worklist({
   SName : req.body.SName,
   Phones : req.body.Phone,
   Contact_Person : req.body.Contact_Person
  });

  newWorklist.check(function(err,workList) {
    if(err) {
      next(err);
    } else {
      newWorklist.CarIdList(function(err,CarIdList){
        console.log('CarIdList Function');
        if(err){
          next(err);
        }else{
          console.log('CarIdList cb'+CarIdList);
          //req.session.CarIdList = CarIdList[0];
          res.render('WorkList/workList', {
            workList : workList,
            CarIdList : CarIdList,
            member : req.session.member || null
          });
        }
      });
    }
  });
});

//編輯點進去 去找該列的資料
router.get('/upWorklist', function(req, res,next) {
  var newUpWorklist = new UpWorklist({
    id : req.query.WorkId || req.session.WorkId
   });

   async.series([
     function(done){
       newUpWorklist.find(function(err,upWorklist) {
        
          req.session.upWorklist = upWorklist[0];
          upWorklist[0].InDate = fecha.format(upWorklist[0].InDate, 'YYYY-MM-DD');
          upWorklist[0].CBirthDate = fecha.format(upWorklist[0].CBirthDate, 'YYYY-MM-DD');
          console.log('upWorklist'+upWorklist[0].WorkId);
     })
   done()

 },function(done){
   newUpWorklist.materiallist(function(err,materiallist) {
     if(err) {
       next(err);
     } else {
         console.log('materiallist done');
         res.render('WorkList/upWorkList', {
           status : req.session.status || null,
           upWorklist : req.session.upWorklist,
           materiallist : materiallist ,
           member : req.session.member || null
         });
     }
   });
   done()

 }
 ]
),function(err){
   if(err) {
     res.status = err.code;
     next();
   } else {

     res.render('WorkList/upWorkList', {

       upWorklist : req.session.upWorklist,
       materiallist : req.session.materiallist,
       member : req.session.member || null
     });
   }
 }
});

//儲存客戶資料
router.post('/saveCustomer', function(req, res,next) {
  var newSaveCustomer = new SaveCustomer({

   });
   newSaveCustomer.saveCustomer(function(err) {
     if(err) {
       next(err);
     } else {
         res.render('WorkList/upWorkList', {

           member : req.session.member || null
         });
     }
   });
});

//儲存材料登錄--每一筆
router.post('/saveMat', function(req, res,next) {
  console.log('saveMat');
  var newSaveMat = new SaveMat({
    WorkId : req.body.id,
    id : req.body.MatId,
    MQuantity : req.body.MQuantity
   });
   console.log(req.body.MQuantity);
   newSaveMat.saveMat();
    req.session.WorkId = req.body.id ;
    res.redirect('/worklist/upWorklist?'+req.session.WorkId);

});


//料號查詢
router.get('/searchPId', function(req, res,next) {
  console.log('searchPId function');
  console.log('searchPId'+req.query.searchPId);
  var newSearchPId = new SearchPId({
    id : req.query.searchPId
   });
  //  newSearchPId.searchPId(function(err,PIdList) {
  //    if(err) {
  //      next(err);
  //    } else {
  //        req.session.PIdList = PIdList;
         res.json(['success','good']);
        //  res.render('WorkList/searchPId', {
        //    PIdList : req.session.PIdList,
        //    member : req.session.member || null
        //  });
    // }
  // });
});

//新增材料登錄--每一筆
router.post('/addMat', function(req, res,next) {
  var status = "add";
  req.session.status = status;
  console.log('addMat');
  console.log(req.body.id);
  req.session.WorkId = req.body.id ;
   res.redirect('/worklist/upWorklist?'+req.session.WorkId);

});


//carhistory車歷卡
router.post('/carHistory', function(req, res, next) {
    console.log('carhistory');
    res.render('WorkList/carHistory', {

        member: req.session.member || null
    });

});

//確定要 update
router.post('/update', function(req, res,next) {
 var newUpdate = new Update({
   id : req.body.id,
   SName : req.body.SName,
   Phone : req.body.Phone,
   Contact_Person : req.body.Contact_Person
  });
          newUpdate.update(function(err) {
            console.log('update');
            if(err) {
              next(err);
            } else {
               if(newUpdate.SName!='')
              {
                newUpdate.check(function(err,WorklistList) {
                  console.log('check');
                  if(err) {
                    next(err);
                  } else {
                    if(newUpdate.SName !='')
                    {
                    req.session.update = newUpdate;
                    res.render('Worklist/WorklistDetail', {
                       WorklistList : WorklistList,
                       member : req.session.member || null
                    });
                  } else {
                        req.session.update = null;
                          res.render('Worklist/WorklistDetail', {
                            SName : null,
                            member : req.session.member || null
                          });
                    }
                  }
                });
            } else {
                  req.session.update = null;
              }
            }
          });



});
//點刪除 要find資料
router.post('/delWorkList', function(req, res,next) {
 res.render('WorkList/delWorkList');

});

router.post('/delete', function(req, res,next) {
  console.log('req.body.id'+req.body.id);
 var newDelete = new Delete({
    id : req.body.id,
   SName : req.body.SName,
   Phone : req.body.Phone,
   Contact_Person : req.body.Contact_Person
  });
  newDelete.del(function(err) {
    if(err) {
      next(err);
    } else {
      if(newDelete.SName!='')
      {
        newDelete.check(function(err,WorklistList) {
          console.log('check');
          if(err) {
            next(err);
          } else {
            if(newDelete.SName !='')
            {
            req.session.delete = newDelete;
            res.render('Worklist/WorklistDetail', {
               WorklistList : WorklistList,
               member : req.session.member || null

            });
          } else {
                req.session.delete = null;
                  res.render('Worklist/WorklistDetail', {
                    SName : null,
                    member : req.session.member || null
                  });
            }
          }
        });
    } else {
          req.session.delete = null;
            res.render('Worklist/WorklistDetail', {
              SName : null,
              member : req.session.member || null
            });
      }
    }
  });
});
module.exports = dateFormat;
module.exports = router;
