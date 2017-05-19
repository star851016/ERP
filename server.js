var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var $ = require('jquery');

var routes = require('./routes/Index/index');
var register = require('./routes/Account/register');
var login = require('./routes/Account/login');
var users = require('./routes/Index/users');
var supplier = require('./routes/Supplier/supplier');
var supplierDetail = require('./routes/Supplier/supplierDetail');
var product = require('./routes/Product/product');
var productDetail = require('./routes/Product/productDetail');
var purchase = require('./routes/Purchase/purchase');
var home1 = require('./routes/Index/home1');
var sup = require('./routes/Supplier/sup');
var addProduct = require('./routes/Product/addProduct');
var delProduct = require('./routes/Product/delProduct');
var upProduct = require('./routes/Product/upProduct');
var purchaseList = require('./routes/Purchase/purchaseList');
var sales = require('./routes/Sales/sales');
var salesList = require('./routes/Sales/salesList');
var bkpurchase = require('./routes/Back/bkpurchase');
var bkpurList = require('./routes/Back/bkpurList');
var bksales = require('./routes/Back/bksales');
var bksalesList = require('./routes/Back/bksalesList');
var report = require('./routes/Report/report');
var rankSupplier = require('./routes/Report/rankSupplier');
var rankFullYear = require('./routes/Report/rankFullYear');
var purSalesReport = require('./routes/Report/purSalesReport');
var workList = require('./routes/WorkList/workList');
var addWorkList= require('./routes/WorkList/addWorkList');
var server= require('./routes/WorkList/Server');
var customer = require('./routes/Customer/customer');
var addCustomer = require('./routes/Customer/addCustomer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({secret : 'HelloExpressSESSION',resave: false,
  saveUninitialized: true}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/register', register);
app.use('/supplier',supplier);
app.use('/supplierDetail',supplierDetail);
app.use('/product',product);
app.use('/productDetail',productDetail);
app.use('/purchase',purchase);
app.use('/home1',home1);
app.use('/sup',sup);
app.use('/addProduct',addProduct);
app.use('/delProduct',delProduct);
app.use('/upProduct',upProduct);
app.use('/purchaseList',purchaseList);
app.use('/sales',sales);
app.use('/salesList',salesList);
app.use('/bkpurchase',bkpurchase);
app.use('/bkpurList',bkpurList);
app.use('/bksales',bksales);
app.use('/bksalesList',bksalesList);
app.use('/report',report);
app.use('/rankSupplier',rankSupplier);
app.use('/rankFullYear',rankFullYear);
app.use('/purSalesReport',purSalesReport);
app.use('/workList',workList);
app.use('/addWorkList',addWorkList);
app.use('/server',server);
app.use('/customer',customer);
app.use('/addCustomer',addCustomer);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('Shared/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('Shared/error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
