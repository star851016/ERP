var express = require('express');
var router = express.Router();
var Member = require('../../models/Member');
var Used = require('../../models/used');
var async = require('async');
var used = new Used();
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.member) {
    res.render('DashBoard/dashboard', {
      member : req.session.member,
      TSales :  req.session.TSales,
      TPrice :  req.session.TPrice,
      ProductNum : req.session.ProductNum,
      CustomerNum : req.session.CustomerNum,
      rankList : req.session.rankList,
      stockList : req.session.stockList,
      sumPurchaseA : req.session.sumPurchaseA,
      sumPurchaseB : req.session.sumPurchaseB,
      sumPurchaseC : req.session.sumPurchaseC,
      sumPurchaseD : req.session.sumPurchaseD,
      sumPurchaseE : req.session.sumPurchaseE,
      sumSalesA : req.session.sumSalesA,
      sumSalesB : req.session.sumSalesB,
      sumSalesC : req.session.sumSalesC,
      sumSalesD : req.session.sumSalesD,
      sumSalesE : req.session.sumSalesE,
      sumSubSalesAY1Q1 : req.session.sumSubSalesAY1Q1,
      sumSubSalesAY1Q2 : req.session.sumSubSalesAY1Q2,
      sumSubSalesAY1Q3 : req.session.sumSubSalesAY1Q3,
      sumSubSalesAY1Q4 : req.session.sumSubSalesAY1Q4,
      sumSubSalesAY2Q1 : req.session.sumSubSalesAY2Q1,
      sumSubSalesAY2Q2 : req.session.sumSubSalesAY2Q2,
      sumSubSalesAY2Q3 : req.session.sumSubSalesAY2Q3,
      sumSubSalesAY2Q4 : req.session.sumSubSalesAY2Q4,
      sumSubSalesAY3Q1 : req.session.sumSubSalesAY3Q1,
      sumSubSalesAY3Q2 : req.session.sumSubSalesAY3Q2,
      sumSubSalesBY1Q1 : req.session.sumSubSalesBY1Q1,
      sumSubSalesBY1Q2 : req.session.sumSubSalesBY1Q2,
      sumSubSalesBY1Q3 : req.session.sumSubSalesBY1Q3,
      sumSubSalesBY1Q4 : req.session.sumSubSalesBY1Q4,
      sumSubSalesBY2Q1 : req.session.sumSubSalesBY2Q1,
      sumSubSalesBY2Q2 : req.session.sumSubSalesBY2Q2,
      sumSubSalesBY2Q3 : req.session.sumSubSalesBY2Q3,
      sumSubSalesBY2Q4 : req.session.sumSubSalesBY2Q4,
      sumSubSalesBY3Q1 : req.session.sumSubSalesBY3Q1,
      sumSubSalesBY3Q2 : req.session.sumSubSalesBY3Q2,
      sumSubSalesCY1Q1 : req.session.sumSubSalesCY1Q1,
      sumSubSalesCY1Q2 : req.session.sumSubSalesCY1Q2,
      sumSubSalesCY1Q3 : req.session.sumSubSalesCY1Q3,
      sumSubSalesCY1Q4 : req.session.sumSubSalesCY1Q4,
      sumSubSalesCY2Q1 : req.session.sumSubSalesCY2Q1,
      sumSubSalesCY2Q2 : req.session.sumSubSalesCY2Q2,
      sumSubSalesCY2Q3 : req.session.sumSubSalesCY2Q3,
      sumSubSalesCY2Q4 : req.session.sumSubSalesCY2Q4,
      sumSubSalesCY3Q1 : req.session.sumSubSalesCY3Q1,
      sumSubSalesCY3Q2 : req.session.sumSubSalesCY3Q2
    });
  }
  res.render('Account/login', {
    member : null,
  });
});

router.post('/', function(req, res, next) {
  var newMember = new Member({
    account : req.body.account,
    password : req.body.password
  });
  newMember.check(function(err) {
    if(err) {
      next(err);
    } else {
      if(newMember.name!='')
      {

      req.session.member = newMember;
      async.series([
        function(done){
          newMember.checkTodayPur(function(err,TPrice) {

            if(err) {
              next(err);
            } else {
              req.session.TPrice = TPrice;
              console.log('req.session.TPrice'+req.session.TPrice);
              done()
            }
          });

        },function(done){
          newMember.checkTodaySales(function(err,TSales) {

            if(err) {
              next(err);
            } else {
              //console.log('TSales'+TSales);
              req.session.TSales = TSales;
              console.log('req.session.TSales'+req.session.TSales);
              done()
            }
          });

        },function(done){
          newMember.countCustomer(function(err,CustomerNum) {

            if(err) {
              next(err);
            } else {
              //console.log('CustomerNum'+CustomerNum);
              req.session.CustomerNum = CustomerNum;
              console.log('req.session.CustomerNum'+req.session.CustomerNum);
              done()
            }
          });

        },function(done){
          newMember.countProduct(function(err,ProductNum) {

            if(err) {
              next(err);
            } else {
              //console.log('ProductNum'+ProductNum);
              req.session.ProductNum = ProductNum;
              console.log('req.session.ProductNum'+req.session.ProductNum);

              done()
            }
          });

        },function(done){
          newMember.remind(function(err,stockList) {

            if(err) {
              next(err);
            } else {
              //console.log('sumPurchaseA'+sumPurchaseA);
              req.session.stockList = stockList;
              done()
            }
          });

        }
        ,function(done){
          newMember.sumPurchaseA(function(err,sumPurchaseA) {

            if(err) {
              next(err);
            } else {
              //console.log('sumPurchaseA'+sumPurchaseA);
              req.session.sumPurchaseA = sumPurchaseA;
              console.log('req.session.sumPurchaseA'+req.session.sumPurchaseA);

              done()
            }
          });

        },function(done){
          newMember.sumPurchaseB(function(err,sumPurchaseB) {

            if(err) {
              next(err);
            } else {
              //console.log('sumPurchaseA'+sumPurchaseA);
              req.session.sumPurchaseB = sumPurchaseB;
              console.log('req.session.sumPurchaseB'+req.session.sumPurchaseB);

              done()
            }
          });

        },function(done){
          newMember.sumPurchaseC(function(err,sumPurchaseC) {

            if(err) {
              next(err);
            } else {
              //console.log('sumPurchaseA'+sumPurchaseA);
              req.session.sumPurchaseC = sumPurchaseC;
              console.log('req.session.sumPurchaseC'+req.session.sumPurchaseC);

              done()
            }
          });

        },function(done){
          newMember.sumPurchaseD(function(err,sumPurchaseD) {

            if(err) {
              next(err);
            } else {
              //console.log('sumPurchaseA'+sumPurchaseA);
              req.session.sumPurchaseD = sumPurchaseD;
              console.log('req.session.sumPurchaseD'+req.session.sumPurchaseD);

              done()
            }
          });

        },function(done){
          newMember.sumPurchaseE(function(err,sumPurchaseE) {

            if(err) {
              next(err);
            } else {
              //console.log('sumPurchaseA'+sumPurchaseA);
              req.session.sumPurchaseE = sumPurchaseE;
              console.log('req.session.sumPurchaseE'+req.session.sumPurchaseE);

              done()
            }
          });

        },function(done){
          newMember.sumSalesA(function(err,sumSalesA) {

            if(err) {
              next(err);
            } else {
              //console.log('sumPurchaseA'+sumPurchaseA);
              req.session.sumSalesA = sumSalesA;
              console.log('req.session.sumSalesA'+req.session.sumSalesA);

              done()
            }
          });

        },function(done){
          newMember.sumSalesB(function(err,sumSalesB) {

            if(err) {
              next(err);
            } else {
              //console.log('sumPurchaseA'+sumPurchaseA);
              req.session.sumSalesB = sumSalesB;
              console.log('req.session.sumSalesB'+req.session.sumSalesB);

              done()
            }
          });

        },function(done){
          newMember.sumSalesC(function(err,sumSalesC) {

            if(err) {
              next(err);
            } else {
              //console.log('sumPurchaseA'+sumPurchaseA);
              req.session.sumSalesC = sumSalesC;
              console.log('req.session.sumSalesC'+req.session.sumSalesC);

              done()
            }
          });

        },function(done){
          newMember.sumSalesD(function(err,sumSalesD) {

            if(err) {
              next(err);
            } else {
              //console.log('sumPurchaseA'+sumPurchaseA);
              req.session.sumSalesD = sumSalesD;
              console.log('req.session.sumSalesD'+req.session.sumSalesD);

              done()
            }
          });

        },function(done){
          newMember.sumSalesE(function(err,sumSalesE) {

            if(err) {
              next(err);
            } else {
              //console.log('sumPurchaseA'+sumPurchaseA);
              req.session.sumSalesE = sumSalesE;
              console.log('req.session.sumSalesE'+req.session.sumSalesE);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesAY1Q1(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesAY1Q1 = sumSubSales;
              console.log('req.session.sumSubSalesAY1Q1'+req.session.sumSubSalesAY1Q1);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesAY1Q2(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesAY1Q2 = sumSubSales;
              console.log('req.session.sumSubSalesAY1Q2'+req.session.sumSubSalesAY1Q2);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesAY1Q3(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesAY1Q3 = sumSubSales;
              console.log('req.session.sumSubSalesAY1Q3'+req.session.sumSubSalesAY1Q3);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesAY1Q4(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesAY1Q4 = sumSubSales;
              console.log('req.session.sumSubSalesAY1Q4'+req.session.sumSubSalesAY1Q4);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesAY2Q1(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesAY2Q1= sumSubSales;
              console.log('req.session.sumSubSalesAY2Q1'+req.session.sumSubSalesAY2Q1);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesAY2Q2(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesAY2Q2 = sumSubSales;
              console.log('req.session.sumSubSalesAY2Q2'+req.session.sumSubSalesAY2Q2);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesAY2Q3(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesAY2Q3 = sumSubSales;
              console.log('req.session.sumSubSalesAY2Q3'+req.session.sumSubSalesAY2Q3);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesAY2Q4(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesAY2Q4 = sumSubSales;
              console.log('req.session.sumSubSalesAY2Q4'+req.session.sumSubSalesAY2Q4);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesAY3Q1(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesAY3Q1 = sumSubSales;
              console.log('req.session.sumSubSalesAY3Q1'+req.session.sumSubSalesAY3Q1);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesAY3Q2(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesAY3Q2 = sumSubSales;
              console.log('req.session.sumSubSalesAY3Q2'+req.session.sumSubSalesAY3Q2);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesBY1Q1(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesBY1Q1 = sumSubSales;
              console.log('req.session.sumSubSalesBY1Q1'+req.session.sumSubSalesBY1Q1);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesBY1Q2(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesBY1Q2 = sumSubSales;
              console.log('req.session.sumSubSalesBY1Q2'+req.session.sumSubSalesBY1Q2);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesBY1Q3(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesBY1Q3 = sumSubSales;
              console.log('req.session.sumSubSalesBY1Q3'+req.session.sumSubSalesBY1Q3);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesBY1Q4(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesBY1Q4 = sumSubSales;
              console.log('req.session.sumSubSalesBY1Q4'+req.session.sumSubSalesBY1Q4);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesBY2Q1(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesBY2Q1= sumSubSales;
              console.log('req.session.sumSubSalesBY2Q1'+req.session.sumSubSalesBY2Q1);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesBY2Q2(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesBY2Q2 = sumSubSales;
              console.log('req.session.sumSubSalesBY2Q2'+req.session.sumSubSalesBY2Q2);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesBY2Q3(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesBY2Q3 = sumSubSales;
              console.log('req.session.sumSubSalesBY2Q3'+req.session.sumSubSalesBY2Q3);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesBY2Q4(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesBY2Q4 = sumSubSales;
              console.log('req.session.sumSubSalesBY2Q4'+req.session.sumSubSalesBY2Q4);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesBY3Q1(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesBY3Q1 = sumSubSales;
              console.log('req.session.sumSubSalesBY3Q1'+req.session.sumSubSalesBY3Q1);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesBY3Q2(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesBY3Q2 = sumSubSales;
              console.log('req.session.sumSubSalesBY3Q2'+req.session.sumSubSalesBY3Q2);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesCY1Q1(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesCY1Q1 = sumSubSales;
              console.log('req.session.sumSubSalesCY1Q1'+req.session.sumSubSalesCY1Q1);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesCY1Q2(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesCY1Q2 = sumSubSales;
              console.log('req.session.sumSubSalesCY1Q2'+req.session.sumSubSalesCY1Q2);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesCY1Q3(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesCY1Q3 = sumSubSales;
              console.log('req.session.sumSubSalesCY1Q3'+req.session.sumSubSalesCY1Q3);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesCY1Q4(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesCY1Q4 = sumSubSales;
              console.log('req.session.sumSubSalesCY1Q4'+req.session.sumSubSalesCY1Q4);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesCY2Q1(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesCY2Q1= sumSubSales;
              console.log('req.session.sumSubSalesCY2Q1'+req.session.sumSubSalesCY2Q1);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesCY2Q2(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesCY2Q2 = sumSubSales;
              console.log('req.session.sumSubSalesCY2Q2'+req.session.sumSubSalesCY2Q2);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesCY2Q3(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesCY2Q3 = sumSubSales;
              console.log('req.session.sumSubSalesCY2Q3'+req.session.sumSubSalesCY2Q3);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesCY2Q4(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesCY2Q4 = sumSubSales;
              console.log('req.session.sumSubSalesCY2Q4'+req.session.sumSubSalesCY2Q4);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesCY3Q1(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesCY3Q1 = sumSubSales;
              console.log('req.session.sumSubSalesCY3Q1'+req.session.sumSubSalesCY3Q1);

              done()
            }
          });

        }
        ,function(done){
          newMember.sumSubSalesCY3Q2(function(err,sumSubSales) {

            if(err) {
              next(err);
            } else {

              req.session.sumSubSalesCY3Q2 = sumSubSales;
              console.log('req.session.sumSubSalesCY3Q2'+req.session.sumSubSalesCY3Q2);

              done()
            }
          });

        }
        ,function(done){
          newMember.rankSupplier(function(err,rankList) {

            if(err) {
              next(err);
            } else {
            //  console.log('rankList'+rankList);
              req.session.rankList = rankList;
            //  console.log('req.session.rankList'+req.session.rankList);
              res.render('DashBoard/dashboard', {
                member : req.session.member,
                TSales :  req.session.TSales,
                TPrice :  req.session.TPrice,
                ProductNum : req.session.ProductNum,
                CustomerNum : req.session.CustomerNum,
                rankList : req.session.rankList,
                stockList : req.session.stockList,
                sumPurchaseA : req.session.sumPurchaseA,
                sumPurchaseB : req.session.sumPurchaseB,
                sumPurchaseC : req.session.sumPurchaseC,
                sumPurchaseD : req.session.sumPurchaseD,
                sumPurchaseE : req.session.sumPurchaseE,
                sumSalesA : req.session.sumSalesA,
                sumSalesB : req.session.sumSalesB,
                sumSalesC : req.session.sumSalesC,
                sumSalesD : req.session.sumSalesD,
                sumSalesE : req.session.sumSalesE,
                sumSubSalesAY1Q1 : req.session.sumSubSalesAY1Q1,
                sumSubSalesAY1Q2 : req.session.sumSubSalesAY1Q2,
                sumSubSalesAY1Q3 : req.session.sumSubSalesAY1Q3,
                sumSubSalesAY1Q4 : req.session.sumSubSalesAY1Q4,
                sumSubSalesAY2Q1 : req.session.sumSubSalesAY2Q1,
                sumSubSalesAY2Q2 : req.session.sumSubSalesAY2Q2,
                sumSubSalesAY2Q3 : req.session.sumSubSalesAY2Q3,
                sumSubSalesAY2Q4 : req.session.sumSubSalesAY2Q4,
                sumSubSalesAY3Q1 : req.session.sumSubSalesAY3Q1,
                sumSubSalesAY3Q2 : req.session.sumSubSalesAY3Q2,
                sumSubSalesBY1Q1 : req.session.sumSubSalesBY1Q1,
                sumSubSalesBY1Q2 : req.session.sumSubSalesBY1Q2,
                sumSubSalesBY1Q3 : req.session.sumSubSalesBY1Q3,
                sumSubSalesBY1Q4 : req.session.sumSubSalesBY1Q4,
                sumSubSalesBY2Q1 : req.session.sumSubSalesBY2Q1,
                sumSubSalesBY2Q2 : req.session.sumSubSalesBY2Q2,
                sumSubSalesBY2Q3 : req.session.sumSubSalesBY2Q3,
                sumSubSalesBY2Q4 : req.session.sumSubSalesBY2Q4,
                sumSubSalesBY3Q1 : req.session.sumSubSalesBY3Q1,
                sumSubSalesBY3Q2 : req.session.sumSubSalesBY3Q2,
                sumSubSalesCY1Q1 : req.session.sumSubSalesCY1Q1,
                sumSubSalesCY1Q2 : req.session.sumSubSalesCY1Q2,
                sumSubSalesCY1Q3 : req.session.sumSubSalesCY1Q3,
                sumSubSalesCY1Q4 : req.session.sumSubSalesCY1Q4,
                sumSubSalesCY2Q1 : req.session.sumSubSalesCY2Q1,
                sumSubSalesCY2Q2 : req.session.sumSubSalesCY2Q2,
                sumSubSalesCY2Q3 : req.session.sumSubSalesCY2Q3,
                sumSubSalesCY2Q4 : req.session.sumSubSalesCY2Q4,
                sumSubSalesCY3Q1 : req.session.sumSubSalesCY3Q1,
                sumSubSalesCY3Q2 : req.session.sumSubSalesCY3Q2
              });
              done()
            }
          });

        }
      ])








    }
      else {
          req.session.member = null;
          res.locals.used =used; //locals -> ejs
            res.render('Account/login', {
              member : null
            });

      }
    }
  });


});

router.post('/logout', function(req, res, next) {
  req.session.member = null;
  res.redirect('/');
});


module.exports = router;
