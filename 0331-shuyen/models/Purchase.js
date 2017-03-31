var db = require('../libs/db');
var GeneralErrors = require('../errors/GeneralErrors');

var Purchase = function(options) {
  this.id = options.id,
  this.SName = options.SName,
  this.TPrice = options.TPrice,
  this.Status = options.Status,
  this.Pur_PName = options.PName;
  this.Pur_Specification = options.Specification;
  this.Pur_Quantity = options.Quantity;//進貨數量
  this.Pur_Types = options.Types;
  this.Pur_Price= options.Price;
  this.SubPrice = options.SubPrice;
};
Purchase.prototype.differentPName = function(cb){
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
Purchase.prototype.differentSpecification = function(cb){
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
Purchase.prototype.differentTypes = function(cb){
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




//撈取supplier 的 id, 新增 進貨單
Purchase.prototype.savePurchase = function(cb){

  var TPrice = this.TPrice;
  var Status = this.Status;
  var SID;
  var Pur_Id;
  db("supplier")
    .where({
      SName : this.SName
    })
    .then(function(result) {
      SID = result[0].id;
      db("purchase")
         .insert({
           SId : SID,
           TPrice : TPrice,
           Status : Status
             })
          .then(function(result){
          Pur_Id = result;

          console.log('Pur_Id'+Pur_Id);
            cb(null, Pur_Id);
          })

         .catch(function(err) {
           console.log("Purchase UPDATED ERROR", err);
           cb(new GeneralErrors.Database());
           });

          })
      .catch(function(err) {
       console.log("Purchase UPDATED ERROR", err);
       cb(new GeneralErrors.Database());
        });
    }

//撈取id 和 原有存貨 一次只能一筆QQ

Purchase.prototype.findPro = function (table,cb) {

    var Pur_PName,Pur_Specification,Pur_Types,Pur_Quantity;
    Pur_PName = this.Pur_PName[table];
    Pur_Specification = this.Pur_Specification[table];
    Pur_Types =  this.Pur_Types[table];
    Pur_Quantity = this.Pur_Quantity[table];
    console.log('table'+table);
    console.log('Pur_PName'+Pur_PName);

  var productId;
  var quantity;//原有存貨


    db.select('product.PName', 'product.id','product.Quantity',
              'product.Specification','product.Types')
       .from('product')
       .where({
         PName :　Pur_PName,
         Specification : Pur_Specification,
         Types : Pur_Types
       })
       .then(function(result) {
         if(result != ''){

           //把撈出來的 id 和 quantity 的值存起來
           productId = result[0].id;
           quantity = result[0].Quantity;
            if(quantity<Pur_Quantity){
              console.log('存貨不足');
              cn(null);
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
  Purchase.prototype.updatePro = function(table,productId,Quantity,cb){
    var Pur_Quantity = this.Pur_Quantity[table];
    var Pur_Price = this.Pur_Price[table];
    var AfterQuantity = parseInt(Pur_Quantity) + parseInt(Quantity);
    db("product")
      .where({
        id :　productId
       })
     .update({
        Quantity : AfterQuantity,
        Pur_Price : Pur_Price
      })
      .then(function(result){
        cb(null, result);
      })
}

//新增存貨
Purchase.prototype.savePro = function(table,cb){
  var Pur_PName,Pur_Specification,Pur_Types,Pur_Price,Pur_Quantity;
  Pur_PName = this.Pur_PName[table];
  Pur_Specification = this.Pur_Specification[table];
  Pur_Types =  this.Pur_Types[table];
  Pur_Price = this.Pur_Price[table];
  Pur_Quantity = this.Pur_Quantity[table];


  var Pur_Id;
   db("product")
    .insert({
      PName : Pur_PName,
      Quantity : Pur_Quantity,
      Specification : Pur_Specification,
      Types : Pur_Types,
      Pur_Price : Pur_Price
    })
    .then(function(result){
    savePro_Id = result;
    console.log('savePro_Id'+savePro_Id);
      cb(null, savePro_Id);
    })
    .catch(function(err) {
     console.log("savePro ERROR", err);
     cb(new GeneralErrors.Database());
     });

};
//新增明細
Purchase.prototype.savePurList = function(table,Pur_Id,Pro_Id,cb){
//  console.log('Pur_Id'+Pur_Id);
  console.log('Pro_Id'+Pro_Id);
   var Pur_Quantity,Pur_Price,SubPrice;
   Pur_Quantity = this.Pur_Quantity[table];
   Pur_Price = this.Pur_Price[table];
   SubPrice = this.SubPrice[table];
   db("purchaseList")
    .insert({
      Pur_Id : Pur_Id,
      Pro_Id : Pro_Id,
      Quantity : Pur_Quantity,
      Price : Pur_Price,
      SubPrice : SubPrice
    })
    .then(function(purchaseList){
      cb(null, purchaseList);
    })
    .catch(function(err) {
     console.log("savePurList ERROR", err);
     cb(new GeneralErrors.Database());
     });

};

Purchase.prototype.check = function (cb,Pur_PName) {
    // console.log('Pur_PName'+Pur_PName);
     console.log('this.Pur_PName'+this.Pur_PName);
     console.log('this.Pur_Specification'+this.Pur_Specification);
     db.select('product.PName', 'product.id','product.Quantity',
               'product.Specification','product.Types')
        .from('product')
        .where({
          PName :　this.Pur_PName,
          Specification : this.Pur_Specification,
          Types : this.Pur_Types
        })
        .then(function(result) {
          //把撈出來的 id 和 quantity 的值存起來
          productId = result[0].id;
          quantity = result[0].Quantity;
            })
        .catch(function(err) {
         console.log("Purchase CHECKED ERROR", err);
         cb(new GeneralErrors.Database());
         });

};


Purchase.prototype.saveA = function (cb) {
  // var productId ;
  // var quantity;
  // var NowQuantity;
  // var AfterQuantity;
  // NowQuantity = this.Pur_Quantity;
  // Supplier_Name = this.Pur_Supplier_Name;
     console.log('this.Pur_PName'+this.Pur_PName);
     console.log('this.Pur_Specification'+this.Pur_Specification);
     db.select('product.PName', 'product.id','product.Quantity',
               'product.Specification','product.Types')
        .from('product')
        .where({
          PName :　this.Pur_PName,
          Specification : this.Pur_Specification,
          Types : this.Pur_Types
        })
        .then(function(result) {
          if(this.id){
            console.log('有商品');
          }
          //把撈出來的 id 和 quantity 的值存起來
          productId = result[0].id;
          quantity = result[0].Quantity;
          console.log('save');
          console.log("id"+productId);
          console.log("quantity"+quantity);
          //console.log(result);
          AfterQuantity = parseInt(NowQuantity) + parseInt(quantity);
          console.log("AfterQuantity"+AfterQuantity);

      db("product")
        .where({
            id :　productId
          })
        .update({
            Quantity : AfterQuantity
          })

        .then(function(result) {
          cb(null, result);
          }.bind(this))

        .catch(function(err) {
         console.log("Purchase UPDATED ERROR", err);
         cb(new GeneralErrors.Database());
         });
        })
};

Purchase.prototype.get = function (cb) {
  var bquantity ;
  var addQuantity;
  var aquantity ;
  db.select('product.PName', 'product.id','product.Quantity',
            'product.Specification','product.Types','purchase.Product_Id','purchase.Supplier_Name')
     .from('product')
     .innerJoin('purchase','product.id','=','purchase.Product_Id')
     .where({
       PName :　this.Pur_Name,
       Specification : this.Pur_Specification,
       Types : this.Pur_Types,
       Supplier_Name : this.Pur_Supplier_Name
     })
     .then(function(purchaseList) {
     bquantity = purchaseList[0].Quantity;
     this.Pur_Name = purchaseList[0].PName;
     this.Pur_Specification = purchaseList[0].Specification;
     this.Pur_Supplier_Name = purchaseList[0].Supplier_Name;
     this.Pur_Types = purchaseList[0].Types;
     purchaseList[0].addQuantity = this.Pur_Quantity;
     aquantity = parseInt(this.Pur_Quantity) + parseInt(bquantity);
     purchaseList[0].aquantity = aquantity;
     console.log('check');
     console.log('bquantity'+bquantity);
     console.log('aquantity'+aquantity);
     //console.log(purchaseList);
       cb(null, purchaseList);
     }.bind(this)
   )
     .catch(function(err) {
       console.log("purchase check", err);
       cb(new GeneralErrors.Database());
     });
}


module.exports = Purchase;
