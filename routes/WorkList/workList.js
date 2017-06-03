var express = require('express');
var router = express.Router();
var Worklist = require('../../models/Worklist');
var UpWorklist = require('../../models/Worklist');
var SearchPId = require('../../models/Worklist');
var Update = require('../../models/Worklist');
var DelWorklist = require('../../models/Worklist');
var Delete = require('../../models/Worklist');
var SaveMat = require('../../models/Worklist');
var FixModel = require('../../models/Worklist');

var dateFormat = require('dateformat');
var fecha = require('fecha');
var async = require('async');


router.get('/', function(req, res) {
    if (!req.session.member) {
        res.redirect('/');
    }
    var newWorklist = new Worklist({
        SName: req.body.SName,
        Phones: req.body.Phone,
        Contact_Person: req.body.Contact_Person
    });

    newWorklist.WorkList(function(err, worklist) {
        if (err) {
            next(err);
        } else {
            res.render('WorkList/workList', {
                worklist: worklist,
                member: req.session.member || null
            });
        }
    });
});

//列印結帳單
router.post('/printBill', function(req, res) {
    if (!req.session.member) {
        // res.redirect('/');
    }

    res.render('WorkList/Bill', {
        upWorklist: req.session.upWorkList,
        materiallist: req.session.materiallist,
        Amount: req.session.Amount,
        member: req.session.member || null
    });

});

router.post('/', function(req, res, next) {
    var newWorklist = new Worklist({
        SName: req.body.SName,
        Phones: req.body.Phone,
        Contact_Person: req.body.Contact_Person
    });

    newWorklist.check(function(err, workList) {
        if (err) {
            next(err);
        } else {
            newWorklist.CarIdList(function(err, CarIdList) {
                console.log('CarIdList Function');
                if (err) {
                    next(err);
                } else {
                    console.log('CarIdList cb' + CarIdList);
                    //req.session.CarIdList = CarIdList[0];
                    res.render('WorkList/workList', {
                        workList: workList,
                        CarIdList: CarIdList,
                        member: req.session.member || null
                    });
                }
            });
        }
    });
});

//編輯點進去 去找該列的資料
router.get('/upWorklist', function(req, res, next) {
    console.log('req.session.WorkId' + req.session.WorkId);
    var newUpWorklist = new UpWorklist({
        id: req.query.WorkId || req.session.WorkId
    });
    if(!req.query.WorkId){
      console.log("從其他function進來");
      req.session.WorkId = req.session.queryId;
    }else {
      console.log("從工單總表進來");
      req.session.queryId = req.query.WorkId;
      // console.log('req.session.queryId'+req.session.queryId);
      req.session.WorkId = req.session.queryId;
      console.log('req.session.WorkId'+req.session.WorkId);
    }
    console.log('req.query.WorkId'+req.query.WorkId);
    newUpWorklist.find(function(err, upWorklist) {
        if (err) {
            next(err);
        } else {

              // req.session.WorkId = req.query.WorkId;
              // console.log('upWorklist[0]'+upWorklist[0]);
              upWorklist[0].InDate = fecha.format(upWorklist[0].InDate, 'YYYY-MM-DD');
              upWorklist[0].ExpectDate = fecha.format(upWorklist[0].ExpectDate, 'YYYY-MM-DD');
              // upWorklist[0].CBirthDate = fecha.format(upWorklist[0].CBirthDate, 'YYYY-MM-DD');
              console.log('upWorklist' + upWorklist[0].WorkId);
              req.session.upWorkList = upWorklist[0];
              newUpWorklist.materiallist(function(err, materiallist) {
                  if (err) {
                      next(err);
                  } else {
                      req.session.materiallist = materiallist;
                      newUpWorklist.bill(function(err, Amount) {

                          req.session.Amount = Amount;
                          console.log('Amount' + Amount);
                          res.render('WorkList/upWorkList', {

                              status: req.session.status || null,
                              upWorklist: req.session.upWorkList,
                              materiallist: req.session.materiallist,
                              Amount: req.session.Amount,
                              member: req.session.member || null
                          });
                      })
                  }

              });

        }
    })



});

//儲存客戶資料
router.post('/saveCustomer', function(req, res, next) {
    var newSaveCustomer = new SaveCustomer({

    });
    newSaveCustomer.saveCustomer(function(err) {
        if (err) {
            next(err);
        } else {
            res.render('WorkList/upWorkList', {

                member: req.session.member || null
            });
        }
    });
});



//儲存材料登錄--每一筆
router.post('/saveMat', function(req, res, next) {
    console.log('saveMat');
    console.log('req.body.MNote' + req.body.MNote[0]);
    var newSaveMat = new SaveMat({
        WorkId: req.body.WorkId,
        id: req.body.MatId,
        PId: req.body.PId,
        PName: req.body.PName,
        MNote: req.body.MNote[0],
        MQuantity: req.body.MQuantity,
        WhoFix: req.body.WhoFix,
        WhoCheck: req.body.WhoCheck,
        Price: req.body.Price,

        // Fix: req.body.impair,
        // Finished: req.body.impaired,
        Amount: req.body.Amount
    });
    console.log('req.body.WhoFix'+req.body.WhoFix);
    console.log(req.body.MatId);
    // newSaveMat.findEmployee(function(err,EmployeeIdList){
    //   req.session.EmployeeIdFix = EmployeeIdList[0].EmployeeIdFix;
    //   req.session.EmployeeIdCheck = EmployeeIdList[0].EmployeeIdCheck;
      if (req.body.MatId == "undefined") {
          console.log("insertMat");
          newSaveMat.insertMat(req.body.WorkId, function(err) {

          });
      } else {
          newSaveMat.saveMat();
      };
    // });


    // console.log('req.body.WorkId'+req.body.WorkId);
    // req.session.WorkId = req.body.WorkId;
    // console.log('req.session.WorkId'+req.session.WorkId);
    res.redirect('/worklist/upWorklist?' + req.session.WorkId);

});


//料號查詢
router.get('/searchPId', function(req, res, next) {
    console.log('searchPId function');
    console.log('searchPId' + req.query.searchPId);
    var newSearchPId = new SearchPId({
        id: req.query.searchPId
    });

    newSearchPId.searchPId(function(err, PIdList) {
        if (err) {
            next(err);
        } else {
            res.json(PIdList);
        }
    });
});

//材料行查詢
router.get('/searchSupplier', function(req, res, next) {
    console.log('searchSupplier function');
    console.log('searchPId' + req.query.searchPId);
    var newSearchPId = new SearchPId({
        id: req.query.searchPId
    });

    newSearchPId.searchSupplier(req.query.searchPId, function(err, SupList) {
        if (err) {
            next(err);
        } else {
          console.log('SupList'+SupList[0].Pur_Price);
            res.json(SupList);
        }
    });
});

//新增材料登錄--每一筆
router.post('/addMat', function(req, res, next) {
    var status = "add";
    req.session.status = status;
    console.log('addMat');
    console.log(req.body.id);
    // req.session.WorkId = req.body.id;
    res.redirect('/worklist/upWorklist?' + req.session.WorkId);

});

//刪除 材料登錄
router.post('/delMat', function(req, res, next) {
    console.log('delMat function');
    console.log('MatId' + req.body.MatId);
    var newWorklist = new Worklist({
        MatId: req.body.MatId
    });
    // req.session.WorkId = req.body.WorkId;
    newWorklist.delMat(function(err) {
        res.redirect('/worklist/upWorklist?' + req.session.WorkId);
    });
});


//carhistory車歷卡
router.get('/carHistory', function(req, res, next) {
    console.log('carhistory');
    var newWorklist = new Worklist({
        SName: req.body.SName,
        Phones: req.body.Phone,
        Contact_Person: req.body.Contact_Person
    });

    newWorklist.carHistory(function(err, worklist) {
        if (err) {
            next(err);
        } else {
            for (i = 0; i < worklist.length; i++) {
                console.log(i);
                worklist[i].OutDate = fecha.format(worklist[i].OutDate, 'YYYY-MM-DD');
            };

            res.render('WorkList/carHistory', {
                worklist: worklist,
                member: req.session.member || null
            });
        }
    });


});

//carhistory車歷卡
router.post('/carHistoryDetail', function(req, res, next) {
    console.log('carHistoryDetail');
    var newWorklist = new Worklist({
        WorkId: req.body.WorkId
    });
    console.log('req.body.WorkId' + req.body.WorkId);
    newWorklist.carHistoryDetail(req.body.WorkId, function(err, materiallist) {
        if (err) {
            next(err);
        } else {
            // console.log('materiallist'+materiallist[0]);
            // console.log('materiallist'+materiallist[0].Id);
            res.render('WorkList/carHistoryDetail', {
                materiallist: materiallist,
                member: req.session.member || null
            });
        }
    });


});
//車歷卡 車牌搜尋
router.post('/carHistorySearch', function(req, res, next) {

    var newSearchPId = new SearchPId({
        CarId: req.body.CarId
    });
    console.log('CarId' + req.body.CarId);
    newSearchPId.carHistorySearch(req.body.CarId, function(err, worklist) {
        if (err) {
            next(err);
        } else {
            for (i = 0; i < worklist.length; i++) {
                console.log(i);
                worklist[i].OutDate = fecha.format(worklist[i].OutDate, 'YYYY-MM-DD');
            };

            res.render('WorkList/carHistory', {
                worklist: worklist,
                member: req.session.member || null
            });
        }
    });
});
//維修套組
router.post('/fixModel', function(req, res, next) {
    console.log('fixModel');
    console.log('req.body.fixModel' + req.body.fixModel);
    console.log('req.session.WorkId' + req.session.WorkId);
    console.log('req.body.CarId' + req.body.CarId);
    var newFixModel = new FixModel({
        CarId: req.body.CarId,
        id: req.session.WorkId,
        fixModel: req.body.fixModel
    });
    newFixModel.fixModel(function(err, materiallist) {
        console.log('materiallist[0].PName' + materiallist[0].PName);
        if (err) {
            next(err);
        } else {
            // var length = fixList.length - 1 ;
            console.log('materiallist.length' + materiallist.length);
            req.session.fixList = materiallist;
            console.log(req.session.fixList);
            for (i = 0; i < materiallist.length; i++) {
                console.log(i);
                newFixModel.insertNewMaterial(req.session.WorkId, req.session.fixList[i], function(err, materiallist) {

                });


            };
            newFixModel.find(function(err, upWorklist) {
                if (err) {
                    next(err);
                } else {
                    upWorklist[0].InDate = fecha.format(upWorklist[0].InDate, 'YYYY-MM-DD');
                    // upWorklist[0].CBirthDate = fecha.format(upWorklist[0].CBirthDate, 'YYYY-MM-DD');
                    console.log('upWorklist' + upWorklist[0].WorkId);

                    newFixModel.materiallist(function(err, materiallist) {
                        if (err) {
                            next(err);
                        } else {

                            res.render('WorkList/upWorkList', {

                                status: req.session.status || null,
                                upWorklist: upWorklist[0],
                                materiallist: materiallist,
                                member: req.session.member || null
                            });
                        }
                    });




                }
            });
        }
    });

});

//結帳登記
router.post('/billsRegister', function(req, res, next) {

    console.log('billsRegister');


    var newSearchPId = new SearchPId({
        WageTotal: req.body.WageAmount,
        MaterialTotal: req.body.Amount,
        PreTaxAmount: req.body.PreTaxAmount,
        Tax: req.body.Tax,
        AccountReceivable: req.body.AccountReceivable,
        RealReceive: req.body.RealReceive,
        discount: req.body.discount,
        WorkId: req.body.WorkId,
        CarId: req.body.CarId
    });

    newSearchPId.saveWorklist(function(err) {
        res.redirect('/worklist');
    });

});

//確定要 update
router.post('/update', function(req, res, next) {
    var newUpdate = new Update({
        id: req.body.id,
        SName: req.body.SName,
        Phone: req.body.Phone,
        Contact_Person: req.body.Contact_Person
    });
    newUpdate.update(function(err) {
        console.log('update');
        if (err) {
            next(err);
        } else {
            if (newUpdate.SName != '') {
                newUpdate.check(function(err, WorklistList) {
                    console.log('check');
                    if (err) {
                        next(err);
                    } else {
                        if (newUpdate.SName != '') {
                            req.session.update = newUpdate;
                            res.render('Worklist/WorklistDetail', {
                                WorklistList: WorklistList,
                                member: req.session.member || null
                            });
                        } else {
                            req.session.update = null;
                            res.render('Worklist/WorklistDetail', {
                                SName: null,
                                member: req.session.member || null
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
//點刪除
router.post('/delWorkList', function(req, res, next) {
  var newDelWorklist = new DelWorklist({
    id : req.body.WorkId
  });
 console.log('req.body.WorkId'+req.body.WorkId);
  newDelWorklist.delWorklist(req.body.WorkId,function(err) {
    console.log('delWorklist');
      res.redirect('/workList');
  });

});

router.post('/delete', function(req, res, next) {
    console.log('req.body.id' + req.body.id);
    var newDelete = new Delete({
        id: req.body.id,
        SName: req.body.SName,
        Phone: req.body.Phone,
        Contact_Person: req.body.Contact_Person
    });
    newDelete.del(function(err) {
        if (err) {
            next(err);
        } else {
            if (newDelete.SName != '') {
                newDelete.check(function(err, WorklistList) {
                    console.log('check');
                    if (err) {
                        next(err);
                    } else {
                        if (newDelete.SName != '') {
                            req.session.delete = newDelete;
                            res.render('Worklist/WorklistDetail', {
                                WorklistList: WorklistList,
                                member: req.session.member || null

                            });
                        } else {
                            req.session.delete = null;
                            res.render('Worklist/WorklistDetail', {
                                SName: null,
                                member: req.session.member || null
                            });
                        }
                    }
                });
            } else {
                req.session.delete = null;
                res.render('Worklist/WorklistDetail', {
                    SName: null,
                    member: req.session.member || null
                });
            }
        }
    });
});
module.exports = dateFormat;
module.exports = router;
