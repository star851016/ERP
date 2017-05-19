var db = require('../libs/db');
var GeneralErrors = require('../errors/GeneralErrors');

var Product = function(options) {
  this.Id = options.Id;
  this.PName = options.PName;
  this.Specification = options.Specification;
  this.Quantity = options.Quantity ;
  this.Types = options.Types;
  this.SafeQuantity = options.SafeQuantity;
  this.Sales_Price = options.Sales_Price;
};
//新增產品
Product.prototype.save = function (cb) {
    db("product")
      .insert({
        PName : this.PName,
        Types : this.Types,
        Specification : this.Specification,
        SafeQuantity : this.SafeQuantity,
        Sales_Price : this.Sales_Price
      })
      .map(function(row) {
        //  this.Id = row.Id;
        console.log('this'+this.PName);
          this.PName = row.PName;
          this.Types = row.Types;
          this.Specification = row.Specification;

            return row;
          console.log('row'+row);
        })
      .then(function(result) {
        console.log('this'+this);
        cb(null, this);
      }.bind(this))
      .catch(function(err) {
        console.log("INSERT ERROR", err);
        cb(new GeneralErrors.Database());
      });

};
Product.prototype.update = function(cb){
  db("product")
    .where({
      Id : this.Id
    })
    .update({
      PName : this.PName,
      Specification : this.Specification,
      Quantity : this.Quantity,
      Types : this.Types
    })
    .then(function() {
      cb(null, this);
    }.bind(this))
    .catch(function(err) {
      console.log("PRODUCT UPDATED", err);
      cb(new GeneralErrors.Database());
    });
}
Product.prototype.delete = function (cb) {
  console.log('delete');
  console.log('Id'+this.Id);
    db("product")
      .where({
        Id : this.Id
      })
      .del()
      .then(function(result) {
        cb(null, this);
      }.bind(this))
      .catch(function(err) {
        console.log("DELETE ERROR", err);
        cb(new GeneralErrors.Database());
      });
};


Product.prototype.check = function(cb){
  db.select('product.PName', 'product.Id','product.Quantity',
                   'product.Specification','product.Types')
            .from('product')


            .then(function(productList) {
              this.Id = productList[0].Id;
              this.PName = productList[0].PName;

              cb(null, productList);
            }.bind(this)
          )
            .catch(function(err) {
              console.log("Product UPDA", err);
              cb(new GeneralErrors.Database());
            });
}

Product.prototype.find = function(cb){
  console.log('hihi'+this.Id);
  db.select('product.PName', 'product.Id','product.Quantity',
                   'product.Specification','product.Types')
            .from('product')
            //.innerJoin('purchase','product.Id','=','purchase.Product_Id')
            .where({
            Id : this.Id

         })
            .then(function(upProduct) {
              this.Id = upProduct[0].Id;
              this.PName = upProduct[0].PName;
              this.Specification = upProduct[0].Specification;
              this.Quantity =upProduct[0].Quantity;
              this.Types = upProduct[0].Types;
              console.log('productList'+upProduct[0].Id);
              //console.log('productList'+upProduct);
              cb(null, upProduct);
            }.bind(this)
          )
            .catch(function(err) {
              console.log("Product UPDA", err);
              cb(new GeneralErrors.Database());
            });
}
//產生下拉式選單的產品名稱清單
Product.prototype.differentPName = function(cb){
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
//產生下拉式選單的產品規格清單
Product.prototype.differentSpecification = function(cb){
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
//產生下拉式選單的產品廠牌清單
Product.prototype.differentTypes = function(cb){
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


Product.prototype.checkA = function (cb) {
      console.log('product');
      db.select('product.PName', 'product.Id','product.Quantity',
                       'product.Specification','product.Types')
                .from('product')

        .where({
        PName : this.PName,

     })
      .map(function(row) {
      //  this.Id = row.Id;
        this.PName = row.PName;
        this.Specification = row.Specification;
        this.Quantity = row.Quantity ;
        this.Types = row.Types;
        //this.Supplier_Name = row.Supplier_Name;
          return row;
      })
      .then(function(productList) {
        //console.log('productList'+productList);
        cb(null, productList);
      }.bind(this)
    )
      .catch(function(err) {
        console.log("Product UPDA", err);
        cb(new GeneralErrors.Database());
      });

};
Product.prototype.checkB = function (cb) {
      console.log('product');
      db.select('product.PName', 'product.Id','product.Quantity',
                       'product.Specification','product.Types')
                .from('product')
                //.innerJoin('purchase','product.Id','=','purchase.Product_Id')
     .where({
       PName : this.PName,
       Types : this.Types,
     })
      .map(function(row) {
      //  this.Id = row.Id;
        this.PName = row.PName;
        this.Specification = row.Specification;
        this.Quantity = row.Quantity ;
        this.Types = row.Types;
      //  this.Supplier_Name = row.Supplier_Name;
          return row;
      })
      .then(function(productList) {
        cb(null, productList);
      }.bind(this)
    )
      .catch(function(err) {
        console.log("Product UPDA", err);
        cb(new GeneralErrors.Database());
      });

};
Product.prototype.checkC = function (cb) {
      console.log('product');
      db.select('product.PName', 'product.Id','product.Quantity',
                       'product.Specification','product.Types')
                .from('product')
                //.innerJoin('purchase','product.Id','=','purchase.Product_Id')
     .where({
       PName : this.PName,
       Specification : this.Specification,

     })
      .map(function(row) {
      //  this.Id = row.Id;
        this.PName = row.PName;
        this.Specification = row.Specification;
        this.Quantity = row.Quantity ;
        this.Types = row.Types;
      //  this.Supplier_Name = row.Supplier_Name;
          return row;
      })
      .then(function(productList) {
        cb(null, productList);
      }.bind(this)
    )
      .catch(function(err) {
        console.log("Product UPDA", err);
        cb(new GeneralErrors.Database());
      });

};
Product.prototype.checkD = function (cb) {
      console.log('product');
      db.select('product.PName', 'product.Id','product.Quantity',
                       'product.Specification','product.Types')
                .from('product')
                //.innerJoin('purchase','product.Id','=','purchase.Product_Id')
     .where({
       PName : this.PName,
       Specification : this.Specification,
       Types : this.Types,
     })
      .map(function(row) {
      //  this.Id = row.Id;
        this.PName = row.PName;
        this.Specification = row.Specification;
        this.Quantity = row.Quantity ;
        this.Types = row.Types;
      //  this.Supplier_Name = row.Supplier_Name;
          return row;
      })
      .then(function(productList) {
        cb(null, productList);
      }.bind(this)
    )
      .catch(function(err) {
        console.log("Product UPDA", err);
        cb(new GeneralErrors.Database());
      });

};
Product.prototype.SpecificationDropdownList = function (cb) {
      console.log('SpecificationDropdownList');
      db.select('product.Specification')
        .distinct('product.Specification')
        .from('product')
        .where({
          Types : this.Types,
        })
        .map(function(row) {
        this.Specification = row.Specification;
          return row;
      })
      .then(function(SpecificationDropdownList) {
        cb(null, SpecificationDropdownList);
      }.bind(this)
    )
      .catch(function(err) {
        console.log("SpecificationList", err);
        cb(new GeneralErrors.Database());
      });

};


module.exports = Product;
