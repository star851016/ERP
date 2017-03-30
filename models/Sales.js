var db = require('../libs/db');
var GeneralErrors = require('../errors/GeneralErrors');

var Sales = function(options) {
  this.ID = options.ID,
  this.CName = options.CName,
  this.TSales = options.TSales,
  this.Status = options.Status,
  this.Sales_PName = options.PName;
  this.Sales_Specification = options.Specification;
  this.Sales_Quantity = options.Quantity;//進貨數量
  this.Sales_Types = options.Types;
  this.Sales_Price= options.Price;
  this.SubPrice = options.SubPrice;
};
Sales.prototype.saveSales = function(cb){

  var TSales = this.TSales;
  var Status = this.Status;
  var CID;
  var Sales_ID;
  db("customer")
    .where({
      CName : this.CName
    })
    .then(function(result) {
     console.log('this.CName'+this.CName);
      CID = result[0].ID;
      db("sales")
         .insert({
           CID : CID,
           TSales : TSales,
           Sales_Status : Status
             })
          .then(function(result){
          Sales_ID = result;

          console.log('Sales_ID'+Sales_ID);
            cb(null, Sales_ID);
          })

         .catch(function(err) {
           console.log("Sales Saved ERROR", err);
           cb(new GeneralErrors.Database());
           });

          })
      .catch(function(err) {
       console.log("Sales Saved ERROR", err);
       cb(new GeneralErrors.Database());
        });
    }
    Sales.prototype.findPro = function (table,cb) {

        var Sales_PName,Sales_Specification,Sales_Types,Sales_Quantity;
        Sales_PName = this.Sales_PName[table];
        Sales_Specification = this.Sales_Specification[table];
        Sales_Types =  this.Sales_Types[table];
        Sales_Quantity = this.Sales_Quantity[table];
        console.log('table'+table);
        console.log('Sales_PName'+Sales_PName);
        console.log('Sales_Quantity'+Sales_Quantity);
      var productId;
      var quantity;//原有存貨


        db.select('product.PName', 'product.id','product.Quantity',
                  'product.Specification','product.Types')
           .from('product')
           .where({
             PName :　Sales_PName,
             Specification : Sales_Specification,
             Types : Sales_Types
           })
           .then(function(result) {
             if(result != ''){

               //把撈出來的 id 和 quantity 的值存起來
               productId = result[0].id;
               quantity = result[0].Quantity;
               console.log('productId'+productId);
               console.log('quantity'+quantity);
               if(parseInt(quantity)<parseInt(Sales_Quantity)){
                 console.log('存貨不足');
                 cb(null);
               }
                 cb(null, result);
             }else{
               console.log('NOT FIND ID');
               cb(null);

             }

            })
           .catch(function(err) {
            console.log("findPro ERROR", err);

            cb(new GeneralErrors.Database());
          });

    };
    //在product table 更新存貨數量和進價
      Sales.prototype.updatePro = function(table,productId,Quantity,cb){
        var Sales_Quantity = this.Sales_Quantity[table];
        var Sales_Price = this.Sales_Price[table];

        var AfterQuantity = parseInt(Quantity) - parseInt(Sales_Quantity);
        db("product")
          .where({
            id :　productId
           })
         .update({
            Quantity : AfterQuantity,
            Sales_Price : Sales_Price
          })
          .then(function(result){
            cb(null, result);
          })
    }
    Sales.prototype.saveSalesList = function(table,Sales_Id,Pro_Id,cb){
    //  console.log('Pur_Id'+Pur_Id);
      console.log('Sales_Id'+Sales_Id);
       var Sales_Quantity,Sales_Price,SubPrice;
       Sales_Quantity = this.Sales_Quantity[table];
       Sales_Price = this.Sales_Price[table];
       SubPrice = this.SubPrice[table];
       db("salesList")
        .insert({

          Sales_ID : Sales_Id,
          Pro_ID : Pro_Id,
          Quantity : Sales_Quantity,
          Price : Sales_Price,
          SubPrice : SubPrice
        })
        .then(function(salesList){
          cb(null, salesList);
        })
        .catch(function(err) {
         console.log("saveSalesList ERROR", err);
         cb(new GeneralErrors.Database());
         });

    };
    Sales.prototype.differentPName = function(cb){
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
    Sales.prototype.differentSpecification = function(cb){
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
    Sales.prototype.differentTypes = function(cb){
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
module.exports = Sales;
