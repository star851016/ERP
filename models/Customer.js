//這是一個Customer Model
var db = require('../libs/db'); //引入我們的sql builder
var GeneralErrors = require('../errors/GeneralErrors');



var Customer = function(options) {
  this.ID = options.ID,
  this.CarId = options.CarId;
  this.CName = options.CName;
  this.BrandID = options.BrandID,
  this.TypeID = options.TypeID,
  this.cc = options.cc,
  this.CarBodyNum = options.CarBodyNum,
  this.YrOfManu = options.YrOfManu,
  this.Contact_Person = options.Contact_Person,
  this.Tell1 = options.Tell1,
  this.Tell2 = options.Tell2,
  this.CBirthDate = options.CBirthDate,
  this.Addr = options.Addr,
  this.UniformNum = options.UniformNum


};

//取得全部客戶資料
Customer.prototype.get = function(cb) {
  db.select()
    .from('customer')
    .innerJoin('car', 'customer.ID', '=', 'car.ID')
    .then(function(CustomerList) {
        cb(null, CustomerList);
    })
    .catch(function(err) {
      cb(err);
    })
}

//客戶名
Customer.prototype.getCName = function(cb) {
  db.select('CName')
    .from('customer')

    .then(function(CNameList) {
        cb(null, CNameList);
    })
    .catch(function(err) {
      cb(err);
    })
}

//依客戶名查詢
Customer.prototype.find = function(cb) {
  db.select()
    .from('customer')
    .innerJoin('car', 'customer.ID', '=', 'car.ID')
    .where('customer.CName', this.CName)
    .then(function(CustomerList) {
        cb(null, CustomerList);
    })
    .catch(function(err) {
      cb(err);
    })
}

//客戶編輯
Customer.prototype.upCustomer = function(cb) {
  console.log('this.ID'+this.ID);
  db.select()
    .from('customer')
    .innerJoin('car', 'customer.ID', '=', 'car.ID')
    .where('customer.ID', this.ID)
    .then(function(upCustomer) {
        cb(null, upCustomer);
    })
    .catch(function(err) {
      cb(err);
    })
}

//新增客戶 車主
Customer.prototype.saveCustomer = function(cb) {
  db.from('customer')
      .insert({
        CName: this.CName,
        Contact_Person : this.Contact_Person,
        Tell1: this.Tell1,
        Tell2: this.Tell2,
        CBirthDate : this.CBirthDate,
        Address : this.Addr,
        UniformNum: this.UniformNum
      })
      .then(function(ID){
        cb(null, ID);
      })
      .catch(function(err) {
          console.log("saveCustomer ERROR", err);
          cb(new GeneralErrors.Database());
      });
}

//新增客戶 車子
Customer.prototype.saveCar = function(ID,cb) {
  console.log('ID'+ID);
  db.from('car')
      .insert({
        ID : ID,
        CarId : this.CarId,
        BrandID : this.BrandID,
        TypeID : this.TypeID,
        cc : this.cc,
        CarBodyNum : this.CarBodyNum,
        YrOfManu : this.YrOfManu
      })
      .then(function(ID){
        cb(null, ID);
      })
      .catch(function(err) {
          console.log("saveCar ERROR", err);
          cb(new GeneralErrors.Database());
      });
}

//編輯客戶
Customer.prototype.updateCus = function(cb) {
  db.from('customer')
      .update({
        CName: this.CName,
        Contact_Person : this.Contact_Person,
        Tell1: this.Tell1,
        UniformNum: this.UniformNum
      })
      .where('customer.ID', this.ID)
      .then(function(ID){
        cb(null, ID);
      })
      .catch(function(err) {
          console.log("updateCus ERROR", err);
          cb(new GeneralErrors.Database());
      });
}
//刪除車
Customer.prototype.deleteCar = function(cb) {
  console.log('deleteCar');
  console.log('this.CarId'+this.CarId);

  db("car")
  .where({
      CarId : this.CarId
    })
      .del()
      .then(function(result) {
        cb(null, this);
      }.bind(this))
      .catch(function(err) {
          console.log("deleteCar ERROR", err);
          cb(new GeneralErrors.Database());
      });
}
//刪除客戶
Customer.prototype.deleteCus = function(cb) {
  console.log('this.ID'+this.ID);
  console.log('deleteCus');
  db("customer")
      .where({
          ID : this.ID
        })
      .del()
      .then(function(result) {
        cb(null, this);
      }.bind(this))
      .catch(function(err) {
          console.log("deleteCus ERROR", err);
          cb(new GeneralErrors.Database());
      });
}
module.exports = Customer;
