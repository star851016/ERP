//這是一個Customer Model
var db = require('../libs/db'); //引入我們的sql builder
var GeneralErrors = require('../errors/GeneralErrors');



var Customer = function(options) {
  this.ID = options.ID;
  this.CName = options.CName;
  this.Tell1 = options.Tell1;
  this.UniformNum = options.UniformNum;
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

module.exports = Customer;
