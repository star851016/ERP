var db = require('../libs/db');
var GeneralErrors = require('../errors/GeneralErrors');

var bkSales = function(options) {
  this.id = options.id,
  this.CName = options.CName,
  this.TSales = options.TSales,
  this.Status = options.Status,
  this.bk_PName = options.PName;
  this.bk_Specification = options.Specification;
  this.bk_Quantity = options.Quantity;//進貨數量
  this.bk_Types = options.Types;
  this.bk_Price= options.Price;
  this.bkSubPrice = options.SubPrice;
};
bkSales.prototype.differentPName = function(cb){
          db.select('product.PName')
            .distinct('product.PName')
            .from('product')
            .then(function(PNameList) {
              //console.log('PNameList'+PNameList);
              cb(null, PNameList);
            }.bind(this)
          )
            .catch(function(err) {
              console.log("Product DIFFERENT", err);
              cb(new GeneralErrors.Database());
            });
}
bkSales.prototype.differentSpecification = function(cb){
          db.select('product.Specification')
            .distinct('product.Specification')
            .from('product')
            .then(function(SpecificationList) {
            //  console.log('SpecificationList'+SpecificationList);
              cb(null, SpecificationList);
            }.bind(this)
          )
            .catch(function(err) {
              console.log("Product DIFFERENTSpecification", err);
              cb(new GeneralErrors.Database());
            });
}
bkSales.prototype.differentTypes = function(cb){
   //console.log('submit');
          db.select('product.Types')
            .distinct('product.Types')
            .from('product')
            .then(function(TypesList) {
            //  console.log('TypesList'+TypesList);
              cb(null, TypesList);
            }.bind(this)
          )
            .catch(function(err) {
              console.log("Product DIFFERENTTypes", err);
              cb(new GeneralErrors.Database());
            });
}
bkSales.prototype.findPro = function (table,cb) {

    var bk_PName,bk_Specification,bk_Types;
    bk_PName = this.bk_PName[table];
    bk_Specification = this.bk_Specification[table];
    bk_Types =  this.bk_Types[table];
    console.log('table'+table);
    console.log('Pur_PName'+bk_PName);

  var productId;
  var quantity;//原有存貨


    db.select('product.PName', 'product.id','product.Quantity',
              'product.Specification','product.Types')
       .from('product')
       .where({
         PName :　bk_PName,
         Specification : bk_Specification,
         Types : bk_Types
       })
       .then(function(result) {
         if(result != ''){

           //把撈出來的 id 和 quantity 的值存起來
           productId = result[0].id;
           quantity = result[0].Quantity;

             cb(null, result);
         }else{
           console.log('NOT FIND ID');
           console.log('無此存貨');
           cb(null);

         }

        })
       .catch(function(err) {
        console.log("findPro ERROR", err);
        cb(new GeneralErrors.Database());
      });

};
bkSales.prototype.savebkSales = function(cb){
  console.log('this.CName'+this.CName);
  var TSales = this.TSales;
  var Status = this.Status;
  var CID;
  var bkSales_Id;
  db("customer")
    .where({
      CName : this.CName
    })
    .then(function(result) {
      CID = result[0].ID;
      console.log('CID'+CID);
      db("bksales")
         .insert({
           CId : CID,
           TSales : TSales,
           bkStatus : Status
             })
          .then(function(result){
          bkSales_Id = result;

          console.log('bkSales_Id'+bkSales_Id);
            cb(null, bkSales_Id);
          })

         .catch(function(err) {
           console.log("bkSales UPDATED ERROR", err);
           cb(new GeneralErrors.Database());
           });

          })
      .catch(function(err) {
       console.log("bkSales UPDATED ERROR", err);
       cb(new GeneralErrors.Database());
        });
    }

    bkSales.prototype.updatebkPro = function(table,productId,Quantity,cb){
      var bk_Quantity = this.bk_Quantity[table];
      var bk_Price = this.bk_Price[table];
      var AfterQuantity = parseInt(Quantity) + parseInt(bk_Quantity);
      db("product")
        .where({
          id :　productId
         })
       .update({
          Quantity : AfterQuantity,
          Sales_Price : bk_Price
        })
        .then(function(result){
          cb(null, result);
        })
}
        bkSales.prototype.savebkSalesList = function(table,bkSales_Id,Pro_Id,cb){

          console.log('Pro_Id'+Pro_Id);
           var bk_Quantity,bk_Price,bkSubPrice;
           bk_Quantity = this.bk_Quantity[table];
           bk_Price = this.bk_Price[table];
           bkSubPrice = this.bkSubPrice[table];
           db("bksaleslist")
            .insert({
              bksales_Id : bkSales_Id,
              Pro_Id : Pro_Id,
              Quantity : bk_Quantity,
              Price : bk_Price,
              SubPrice : bkSubPrice
            })
            .then(function(bksalesList){
              cb(null, bksalesList);
            })
            .catch(function(err) {
             console.log("savebkSalesList ERROR", err);
             cb(new GeneralErrors.Database());
             });

        };


module.exports = bkSales;
