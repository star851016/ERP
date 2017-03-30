var db = require('../libs/db');
var GeneralErrors = require('../errors/GeneralErrors');

var Report = function(options) {
//  this.id = options.id,
  //this.Time = options.CreateTime

};



//查詢今日進貨
Report.prototype.checkTodayPur = function (cb,Pur_PName) {
  var time = new Date();
  var DateTime = time.toLocaleDateString();
  console.log('time'+DateTime);


     db.select('PurList_Id', 'Pur_Id','Pro_Id',
               'Quantity','Price','SubPrice','CreateTime')
        .from('purchaseList')
        .where('CreateTime', 'like', '%'+DateTime+'%')
        .then(function(result) {
          console.log('result'+result);
          cb(null,result);
            })
        .catch(function(err) {
         console.log("Report CHECKED ERROR", err);
         cb(new GeneralErrors.Database());
         });

};
//查詢今日進貨額
Report.prototype.checkTodayPur = function (cb,TPurchase) {
  var time = new Date();
  var DateTime = time.toLocaleDateString();
  console.log('time'+DateTime);
  var TPrice;
  //var SQL = "SELECT SUM(TPrice) as TPrice FROM `purchase` WHERE CreateTime LIKE '%"+DateTime+"%'"
      db.select(db.raw('SUM(TPrice) as TPrice'))
        .from('purchase')
        .where('CreateTime', 'like', '%'+DateTime+'%')
        .then(function(result) {
          TPrice = result[0].TPrice;
          console.log('TPrice'+TPrice);
          console.log(result);
          cb(null,result);
            })
        .catch(function(err) {
         console.log("Report CHECKED ERROR", err);
         cb(new GeneralErrors.Database());
         });

};
//查詢今日銷貨額
Report.prototype.checkTodaySales = function (cb,TSales) {
  var time = new Date();
  var DateTime = time.toLocaleDateString();
  console.log('time'+DateTime);
  var TSales;

      db.select('TSales')
        .sum('TSales')
        .from('sales')
        .where('CreateTime', 'like', '%'+DateTime+'%')
        .then(function(result) {
          TSales = result[0].SUMTSales;
          console.log('TSales'+TSales);
          console.log('result'+result);
          cb(null,result);
            })
        .catch(function(err) {
         console.log("checkTodaySales ERROR", err);
         cb(new GeneralErrors.Database());
         });

};


//顧客總數
Report.prototype.countCustomer = function (cb,CustomerNum) {

      db.count('ID')
        .from('customer')
        .then(function(result) {
          console.log('result'+result);
          cb(null,result);
            })
        .catch(function(err) {
         console.log("countCustomer ERROR", err);
         cb(new GeneralErrors.Database());
         });

};
//產品總數
Report.prototype.countProduct = function (cb,ProductNum) {

      db.count('Id')
        .from('product')
        .then(function(result) {
          console.log('result'+result);
          cb(null,result);
            })
        .catch(function(err) {
         console.log("countProduct ERROR", err);
         cb(new GeneralErrors.Database());
         });

};
//進貨額排行
Report.prototype.rankSupplier = function (StartTime,EndTime,cb) {

     db.select('supplier.SName','purchase.TPrice')
        .sum('purchase.TPrice')
        .from('purchase')
        .innerJoin('supplier','purchase.SId','supplier.id')
        .whereBetween('purchase.CreateTime', [StartTime, EndTime])
        .groupBy('supplier.SName')
        .orderBy('TPrice', 'desc')
        .then(function(rankList) {
          console.log('rankList'+rankList);
          cb(null,rankList);
            })
        .catch(function(err) {
         console.log("rankSupplier ERROR", err);
         cb(new GeneralErrors.Database());
         });

};
//查詢進貨日報表
Report.prototype.checkPurchase = function (StartTime,EndTime,cb) {
  var CreateTime;
     console.log('StartTime'+StartTime);
     console.log('EndTime'+EndTime);
     db.select('purchase.CreateTime', 'purchase.Pur_Id','supplier.SName',
               'product.PName','product.Types','product.Specification',
               'purchaselist.Quantity','purchaselist.Price','purchaselist.SubPrice',
               'purchase.TPrice')
        .from('purchase')
        .innerJoin('supplier','purchase.SId','supplier.id ')
        .innerJoin('purchaselist','purchase.Pur_Id','purchaselist.Pur_Id')
        .innerJoin('product','purchaselist.Pro_Id','product.id')
        .whereBetween('purchase.CreateTime', [StartTime, EndTime])
        .then(function(checkPurchase) {
          // var CTime = checkPurchase.CreateTime.substr(0, 16);
          // console.log('CTime'+CTime);
          console.log('checkPurchase'+checkPurchase);
          cb(null,checkPurchase);
            })
        .catch(function(err) {
         console.log("checkPurchase ERROR", err);
         cb(new GeneralErrors.Database());
         });

};
Report.prototype.findSupplier = function(cb){
  db.select('supplier.SName')
    .from('supplier')
    .then(function(SupplierList){
      console.log('SupplierList'+SupplierList);
      cb(null,SupplierList);
    })
    .catch(function(err) {
     console.log("findSupplier ERROR", err);
     cb(new GeneralErrors.Database());
     });
};
Report.prototype.rankFullYear = function (cb) {

     db.select('supplier.SName','purchase.TPrice')
        .sum('purchase.TPrice')
        .from('purchase')
        .innerJoin('supplier','purchase.SId','supplier.id')
        .groupBy('supplier.SName')
        .orderBy('TPrice', 'desc')
        .then(function(rankList) {
          console.log('rankList'+rankList);
          cb(null,rankList);
            })
        .catch(function(err) {
         console.log("rankSupplier ERROR", err);
         cb(new GeneralErrors.Database());
         });
      db.select('purchase.CreateTime', 'purchase.Pur_Id','supplier.SName',
                   'product.PName','product.Types','product.Specification',
                   'purchaselist.Quantity','purchaselist.Price','purchaselist.SubPrice',
                   'purchase.TPrice')
            .from('purchase')
            .innerJoin('supplier','purchase.SId','supplier.id ')
            .innerJoin('purchaselist','purchase.Pur_Id','purchaselist.Pur_Id')
            .innerJoin('product','purchaselist.Pro_Id','product.id')
            .then(function(checkPurchase) {
              // var CTime = checkPurchase.CreateTime.substr(0, 16);
              // console.log('CTime'+CTime);
              console.log('checkPurchase'+checkPurchase);
              cb(null,checkPurchase);
                })
            .catch(function(err) {
             console.log("checkPurchase ERROR", err);
             cb(new GeneralErrors.Database());
             });
};





module.exports = Report;
