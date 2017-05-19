var db = require('../libs/db');
var GeneralErrors = require('../errors/GeneralErrors');

var Supplier = function(options) {
  this.id = options.id;
  this.SName = options.SName;
  this.Tell1 = options.Tell1;
  this.Contact_Person = options.Contact_Person ;
};
//check 不設條件
Supplier.prototype.check = function (cb) {
      console.log('supplier_check');
    db("supplier")
      .then(function(supplierList) {
        cb(null, supplierList);
      }.bind(this)
    )
      .catch(function(err) {
        console.log("Supplier CHECKED", err);
        cb(new GeneralErrors.Database());
      });
//}
};
//find 找id
Supplier.prototype.find = function(cb){
         db("supplier")
            .where({
            id : this.id
         })
            .then(function(upSupplier) {
              this.id = upSupplier[0].id;
              this.SName = upSupplier[0].SName;
              this.Tell1 = upSupplier[0].Tell1;
              this.Contact_Person = upSupplier[0].Contact_Person;
              console.log('upSupplier'+upSupplier);
              console.log('upSupplier[0].SName'+upSupplier[0].SName);
              cb(null, upSupplier);
            }.bind(this)
          )
            .catch(function(err) {
              console.log("Supplier FIND", err);
              cb(new GeneralErrors.Database());
            });
};
//get 設公司名稱當條件
Supplier.prototype.get = function(cb){
         console.log('SName'+this.SName);
         db("supplier")
            .where({
            SName : this.SName
         })
           .map(function(row) {
         //  this.id = row.id;
           this.SName = row.SName;
           this.Contact_Person = row.Contact_Person;
           this.Tell1= row.Tell1 ;
           //this.Supplier_Name = row.Supplier_Name;
             return row;
            // console.log('row'+row);
         })
            .then(function(SupplierList) {
              // this.id = upSupplier[0].id;
              // this.SName = upSupplier[0].SName;
              // this.Tell1 = upSupplier[0].Tell1;
              // this.Contact_Person = upSupplier[0].Contact_Person;
              console.log('SupplierList'+SupplierList);
              // console.log('upSupplier[0].SName'+upSupplier[0].SName);
              cb(null, SupplierList);
            }.bind(this)
          )
            .catch(function(err) {
              console.log("Supplier GET", err);
              cb(new GeneralErrors.Database());
            });
};
Supplier.prototype.update = function(cb){
  db("supplier")
    .where({
      id : this.id
    })
    .update({
      SName : this.SName,
      Tell1 : this.Tell1,
      Contact_Person : this.Contact_Person
    })
    .then(function() {
      cb(null, this);
    }.bind(this))
    .catch(function(err) {
      console.log("SUPPLIER UPDATED", err);
      cb(new GeneralErrors.Database());
    });
};
Supplier.prototype.del = function (cb) {
  console.log('delete');
  console.log('id'+this.id);
    db("supplier")
      .where({
        id : this.id
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
Supplier.prototype.save = function (cb) {
    db("supplier")
      .insert({
        SName : this.SName,
        Tell1 : this.Tell1,
        Contact_Person : this.Contact_Person
      })
      .map(function(row) {
        //  this.id = row.id;
        console.log('this'+this.SName);
          this.SName = row.SName;
          this.Tell1 = row.Tell1;
          this.Contact_Person = row.Contact_Person;
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



module.exports = Supplier;
