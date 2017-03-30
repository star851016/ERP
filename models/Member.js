//這是一個Member Model
var db = require('../libs/db'); //引入我們的sql builder
var GeneralErrors = require('../errors/GeneralErrors');



var Member = function(options) {
  this.id = options.id;
  this.name = options.name;
  this.password = options.password;
  this.account = options.account;
};

//Class Function
Member.get = function(memberId, cb) {
  db.select()
    .from('member')
    .where({
      id : memberId
    })
    .map(function(row) {
      return new Member(row);
    })
    .then(function(memberList) {
      if(memberList.length) {
        cb(null, memberList[0]);
      } else {
        cb(new GeneralErrors.NotFound());
      }
    })
    .catch(function(err) {
      cb(err);
    })
}



Member.prototype.save = function (cb) {
  console.log('this.id'+this.id);
  if (this.id) {

    db("member")
      .where({
        id : this.id
      })
      .update({
        name : this.name,
        account : this.account,
        password : this.password
      })
      .then(function() {
        cb(null, this);
      }.bind(this))
      .catch(function(err) {
        console.log("MEMBER UPDATED", err);
        cb(new GeneralErrors.Database());
      });
  } else {

    db("member")
      .insert({
        name: this.name,
        account: this.account,
        password: this.password
      })
      .then(function(result) {
        var insertedId = result[0];
        this.id = insertedId;
        cb(null, this);
      }.bind(this))
      .catch(function(err) {
        console.log("MEMBER INSERT", err);
        cb(new GeneralErrors.Database());
      });
  }
};


Member.prototype.check = function (cb) {

    db("member")
      .where({
        account : this.account,
        password : this.password
      }).map(function(row) {
          this.name = row.name;
          return this.name;
      })
      .then(function(result) {
        var name = result;
        this.name = name;
        cb(null, this);
      }.bind(this))
      .catch(function(err) {
        console.log("MEMBER UPDATED", err);
        cb(new GeneralErrors.Database());
      });
//}
};
//查詢今日進貨額
Member.prototype.checkTodayPur = function (cb,TPurchase) {
  var time = new Date();
  var DateTime = time.toLocaleDateString();
  //console.log('time'+DateTime);
  var TPrice;
  //var SQL = "SELECT SUM(TPrice) as TPrice FROM `purchase` WHERE CreateTime LIKE '%"+DateTime+"%'"
      db.select(db.raw('SUM(TPrice) as TPrice'))
        .from('purchase')
        .where('CreateTime', 'like', '%'+DateTime+'%')
        .then(function(result) {
          TPrice = result[0].TPrice;
          //console.log('TPrice'+TPrice);
          //console.log(result);
          cb(null,TPrice);
            })
        .catch(function(err) {
         console.log("Report CHECKED ERROR", err);
         cb(new GeneralErrors.Database());
         });

};
//查詢今日銷貨額
Member.prototype.checkTodaySales = function (cb,TSales) {
  var time = new Date();
  var DateTime = time.toLocaleDateString();
  //console.log('time'+DateTime);
  var TSales;

      db.select(db.raw('SUM(TSales) as TSales'))
        .from('sales')
        .where('CreateTime', 'like', '%'+DateTime+'%')
        .then(function(result) {
          TSales = result[0].TSales;
          //console.log('TSales'+TSales);
          //console.log(result);
          cb(null,TSales);
            })
        .catch(function(err) {
         console.log("checkTodaySales ERROR", err);
         cb(new GeneralErrors.Database());
         });

};


//顧客總數
Member.prototype.countCustomer = function (cb,CustomerNum) {

  var CustomerNum;

      db.select(db.raw('COUNT(ID) as IDNum'))
        .from('customer')
        .then(function(result) {
          CustomerNum = result[0].IDNum;
          //console.log('result'+result);
          cb(null,CustomerNum);
            })
        .catch(function(err) {
         console.log("countCustomer ERROR", err);
         cb(new GeneralErrors.Database());
         });

};
//產品總數
Member.prototype.countProduct = function (cb,ProductNum) {



      db.select(db.raw('COUNT(Id) as ProductNum'))
        .from('product')
        .then(function(result) {
          ProductNum = result[0].ProductNum;
          //console.log('result'+result);
          cb(null,ProductNum);
            })
        .catch(function(err) {
         console.log("countProduct ERROR", err);
         cb(new GeneralErrors.Database());
         });

};
//廠商進貨排行
Member.prototype.rankSupplier = function (cb) {

     db.select('supplier.SName','purchase.TPrice')
        .sum('purchase.TPrice')
        .from('purchase')
        .innerJoin('supplier','purchase.SId','supplier.id')
        .groupBy('supplier.SName')
        .orderBy('TPrice', 'desc')
        .then(function(rankList) {
          //console.log('rankList'+rankList);
          cb(null,rankList);
            })
        .catch(function(err) {
         console.log("rankSupplier ERROR", err);
         cb(new GeneralErrors.Database());
         });

};
//庫存警示
Member.prototype.remind = function (cb) {

       db.select('PName','Specification','Types','Quantity','SafeQuantity')
        .from('product')
        .whereRaw('Quantity < SafeQuantity')
        .then(function(stockList) {
          console.log(stockList);
          cb(null,stockList);
            })
        .catch(function(err) {
         console.log("remind ERROR", err);
         cb(new GeneralErrors.Database());
         });
};
//各年進貨額
Member.prototype.sumPurchaseA = function (cb,sumPurchaseA) {

      db.select(db.raw('SUM(TPrice) as TPrice'))
        .from('purchase')
        .where('CreateTime', 'like', '%2012%')
        .then(function(result) {
          sumPurchaseA = result[0].TPrice;
          //console.log('result'+result);
          cb(null,sumPurchaseA);
            })
        .catch(function(err) {
         console.log("sumPurchaseA ERROR", err);
         cb(new GeneralErrors.Database());
         });
};
Member.prototype.sumPurchaseB = function (cb,sumPurchaseB) {



      db.select(db.raw('SUM(TPrice) as TPrice'))
        .from('purchase')
        .where('CreateTime', 'like', '%2013%')
        .then(function(result) {
          sumPurchaseB = result[0].TPrice;
          //console.log('result'+result);
          cb(null,sumPurchaseB);
            })
        .catch(function(err) {
         console.log("sumPurchaseB ERROR", err);
         cb(new GeneralErrors.Database());
         });
};
Member.prototype.sumPurchaseC = function (cb,sumPurchaseC) {



      db.select(db.raw('SUM(TPrice) as TPrice'))
        .from('purchase')
        .where('CreateTime', 'like', '%2014%')
        .then(function(result) {
          sumPurchaseC = result[0].TPrice;
          //console.log('result'+result);
          cb(null,sumPurchaseC);
            })
        .catch(function(err) {
         console.log("sumPurchaseC ERROR", err);
         cb(new GeneralErrors.Database());
         });
};
Member.prototype.sumPurchaseD = function (cb,sumPurchaseD) {



      db.select(db.raw('SUM(TPrice) as TPrice'))
        .from('purchase')
        .where('CreateTime', 'like', '%2015%')
        .then(function(result) {
          sumPurchaseD = result[0].TPrice;
          //console.log('result'+result);
          cb(null,sumPurchaseD);
            })
        .catch(function(err) {
         console.log("sumPurchaseD ERROR", err);
         cb(new GeneralErrors.Database());
         });
};
Member.prototype.sumPurchaseE = function (cb,sumPurchaseE) {



      db.select(db.raw('SUM(TPrice) as TPrice'))
        .from('purchase')
        .where('CreateTime', 'like', '%2016%')
        .then(function(result) {
          sumPurchaseE = result[0].TPrice;
          //console.log('result'+result);
          cb(null,sumPurchaseE);
            })
        .catch(function(err) {
         console.log("sumPurchaseE ERROR", err);
         cb(new GeneralErrors.Database());
         });
};
//各年銷貨額
Member.prototype.sumSalesA= function (cb,sumSalesA) {



      db.select(db.raw('SUM(TSales) as TSales'))
        .from('sales')
        .where('CreateTime', 'like', '%2012%')
        .then(function(result) {
          sumSalesA = result[0].TSales;
          //console.log('result'+result);
          cb(null,sumSalesA);
            })
        .catch(function(err) {
         console.log("sumSalesA ERROR", err);
         cb(new GeneralErrors.Database());
         });
};
Member.prototype.sumSalesB= function (cb,sumSalesB) {



      db.select(db.raw('SUM(TSales) as TSales'))
        .from('sales')
        .where('CreateTime', 'like', '%2013%')
        .then(function(result) {
          sumSalesB = result[0].TSales;
          //console.log('result'+result);
          cb(null,sumSalesB);
            })
        .catch(function(err) {
         console.log("sumSalesB ERROR", err);
         cb(new GeneralErrors.Database());
         });
};
Member.prototype.sumSalesC= function (cb,sumSalesC) {



      db.select(db.raw('SUM(TSales) as TSales'))
        .from('sales')
        .where('CreateTime', 'like', '%2014%')
        .then(function(result) {
          sumSalesC = result[0].TSales;
          //console.log('result'+result);
          cb(null,sumSalesC);
            })
        .catch(function(err) {
         console.log("sumSalesC ERROR", err);
         cb(new GeneralErrors.Database());
         });
};
Member.prototype.sumSalesD = function (cb,sumSalesD) {



      db.select(db.raw('SUM(TSales) as TSales'))
        .from('sales')
        .where('CreateTime', 'like', '%2015%')
        .then(function(result) {
          sumSalesD = result[0].TSales;
          //console.log('result'+result);
          cb(null,sumSalesD);
            })
        .catch(function(err) {
         console.log("sumSalesD ERROR", err);
         cb(new GeneralErrors.Database());
         });
};
Member.prototype.sumSalesE = function (cb,sumSalesE) {



      db.select(db.raw('SUM(TSales) as TSales'))
        .from('sales')
        .where('CreateTime', 'like', '%2016%')
        .then(function(result) {
          sumSalesE = result[0].TSales;
          //console.log('result'+result);
          cb(null,sumSalesE);
            })
        .catch(function(err) {
         console.log("sumSalesE ERROR", err);
         cb(new GeneralErrors.Database());
         });
};
//輪胎第一年第一季銷貨額
Member.prototype.sumSubSalesAY1Q1 = function (cb,sumSubSales) {

      db.select(db.raw('SUM(SubPrice) as SubPrice'))
        .from('saleslist')
        .where('Pro_Id', '=', '12')
        .whereBetween('CreateTime', ['2014-01-01 00:00:00', '2014-03-31 00:00:00'])
        .then(function(result) {
          sumSubSales = result[0].SubPrice;
          //console.log('result'+result);
          cb(null,sumSubSales);
            })
        .catch(function(err) {
         console.log("sumSubSalesAY1Q1 ERROR", err);
         cb(new GeneralErrors.Database());
         });
};
//輪胎第一年第二季銷貨額
Member.prototype.sumSubSalesAY1Q2 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2014-04-01 00:00:00', '2014-06-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q2 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};
//輪胎第一年第三季銷貨額
Member.prototype.sumSubSalesAY1Q3 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2014-07-01 00:00:00', '2014-09-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q3 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};
//輪胎第一年第四季銷貨額
Member.prototype.sumSubSalesAY1Q4 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2014-10-01 00:00:00', '2014-12-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q4 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};
//輪胎第二年第一季銷貨額
Member.prototype.sumSubSalesAY2Q1 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2015-01-01 00:00:00', '2015-03-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q1 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};
//輪胎第二年第二季銷貨額
Member.prototype.sumSubSalesAY2Q2 = function (cb,sumSubSalesAQ4) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2015-04-01 00:00:00', '2015-06-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q2 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};
//輪胎第二年第三季銷貨額
Member.prototype.sumSubSalesAY2Q3 = function (cb,sumSubSalesAQ4) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2015-07-01 00:00:00', '2015-09-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q3 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};
//輪胎第二年第四季銷貨額
Member.prototype.sumSubSalesAY2Q4 = function (cb,sumSubSalesAQ4) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2015-10-01 00:00:00', '2015-12-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q4 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};
//輪胎第三年第一季銷貨額
Member.prototype.sumSubSalesAY3Q1 = function (cb,sumSubSalesAQ4) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2016-01-01 00:00:00', '2016-03-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q1 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};
//輪胎第三年第二季銷貨額
Member.prototype.sumSubSalesAY3Q2 = function (cb,sumSubSalesAQ4) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2016-04-01 00:00:00', '2016-06-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q2 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};
Member.prototype.sumSubSalesAY1Q1 = function (cb,sumSubSales) {

      db.select(db.raw('SUM(SubPrice) as SubPrice'))
        .from('saleslist')
        .where('Pro_Id', '=', '12')
        .whereBetween('CreateTime', ['2014-01-01 00:00:00', '2014-03-31 00:00:00'])
        .then(function(result) {
          sumSubSales = result[0].SubPrice;
          //console.log('result'+result);
          cb(null,sumSubSales);
            })
        .catch(function(err) {
         console.log("sumSubSalesAY1Q1 ERROR", err);
         cb(new GeneralErrors.Database());
         });
};
//輪胎第一年第二季銷貨額
Member.prototype.sumSubSalesAY1Q2 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2014-04-01 00:00:00', '2014-06-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q2 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};
//輪胎第一年第三季銷貨額
Member.prototype.sumSubSalesAY1Q3 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2014-07-01 00:00:00', '2014-09-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q3 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};
//輪胎第一年第四季銷貨額
Member.prototype.sumSubSalesAY1Q4 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2014-10-01 00:00:00', '2014-12-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q4 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};
//輪胎第二年第一季銷貨額
Member.prototype.sumSubSalesAY2Q1 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2015-01-01 00:00:00', '2015-03-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q1 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};
//輪胎第二年第二季銷貨額
Member.prototype.sumSubSalesAY2Q2 = function (cb,sumSubSalesAQ4) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2015-04-01 00:00:00', '2015-06-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q2 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};
//輪胎第二年第三季銷貨額
Member.prototype.sumSubSalesAY2Q3 = function (cb,sumSubSalesAQ4) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2015-07-01 00:00:00', '2015-09-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q3 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};
//輪胎第二年第四季銷貨額
Member.prototype.sumSubSalesAY2Q4 = function (cb,sumSubSalesAQ4) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2015-10-01 00:00:00', '2015-12-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q4 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};
//輪胎第三年第一季銷貨額
Member.prototype.sumSubSalesAY3Q1 = function (cb,sumSubSalesAQ4) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2016-01-01 00:00:00', '2016-03-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q1 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};
//輪胎第三年第二季銷貨額
Member.prototype.sumSubSalesAY3Q2 = function (cb,sumSubSalesAQ4) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '12')
    .whereBetween('CreateTime', ['2016-04-01 00:00:00', '2016-06-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q2 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};
//機油
Member.prototype.sumSubSalesBY1Q1 = function (cb,sumSubSales) {

      db.select(db.raw('SUM(SubPrice) as SubPrice'))
        .from('saleslist')
        .where('Pro_Id', '=', '9')
        .whereBetween('CreateTime', ['2014-01-01 00:00:00', '2014-03-31 00:00:00'])
        .then(function(result) {
          sumSubSales = result[0].SubPrice;
          //console.log('result'+result);
          cb(null,sumSubSales);
            })
        .catch(function(err) {
         console.log("sumSubSalesAY1Q1 ERROR", err);
         cb(new GeneralErrors.Database());
         });
};

Member.prototype.sumSubSalesBY1Q2 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '9')
    .whereBetween('CreateTime', ['2014-04-01 00:00:00', '2014-06-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q2 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};

Member.prototype.sumSubSalesBY1Q3 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '9')
    .whereBetween('CreateTime', ['2014-07-01 00:00:00', '2014-09-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q3 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};

Member.prototype.sumSubSalesBY1Q4 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '9')
    .whereBetween('CreateTime', ['2014-10-01 00:00:00', '2014-12-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q4 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};

Member.prototype.sumSubSalesBY2Q1 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '9')
    .whereBetween('CreateTime', ['2015-01-01 00:00:00', '2015-03-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q1 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};

Member.prototype.sumSubSalesBY2Q2 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '9')
    .whereBetween('CreateTime', ['2015-04-01 00:00:00', '2015-06-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q2 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};

Member.prototype.sumSubSalesBY2Q3 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '9')
    .whereBetween('CreateTime', ['2015-07-01 00:00:00', '2015-09-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q3 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};

Member.prototype.sumSubSalesBY2Q4 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '9')
    .whereBetween('CreateTime', ['2015-10-01 00:00:00', '2015-12-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q4 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};

Member.prototype.sumSubSalesBY3Q1 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '9')
    .whereBetween('CreateTime', ['2016-01-01 00:00:00', '2016-03-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q1 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};

Member.prototype.sumSubSalesBY3Q2 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '9')
    .whereBetween('CreateTime', ['2016-04-01 00:00:00', '2016-06-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q2 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};
//火星塞
Member.prototype.sumSubSalesCY1Q1 = function (cb,sumSubSales) {

      db.select(db.raw('SUM(SubPrice) as SubPrice'))
        .from('saleslist')
        .where('Pro_Id', '=', '434')
        .whereBetween('CreateTime', ['2014-01-01 00:00:00', '2014-03-31 00:00:00'])
        .then(function(result) {
          sumSubSales = result[0].SubPrice;
          //console.log('result'+result);
          cb(null,sumSubSales);
            })
        .catch(function(err) {
         console.log("sumSubSalesAY1Q1 ERROR", err);
         cb(new GeneralErrors.Database());
         });
};

Member.prototype.sumSubSalesCY1Q2 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '434')
    .whereBetween('CreateTime', ['2014-04-01 00:00:00', '2014-06-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q2 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};

Member.prototype.sumSubSalesCY1Q3 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '434')
    .whereBetween('CreateTime', ['2014-07-01 00:00:00', '2014-09-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q3 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};

Member.prototype.sumSubSalesCY1Q4 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '434')
    .whereBetween('CreateTime', ['2014-10-01 00:00:00', '2014-12-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q4 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};

Member.prototype.sumSubSalesCY2Q1 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '434')
    .whereBetween('CreateTime', ['2015-01-01 00:00:00', '2015-03-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q1 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};

Member.prototype.sumSubSalesCY2Q2 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '434')
    .whereBetween('CreateTime', ['2015-04-01 00:00:00', '2015-06-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q2 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};

Member.prototype.sumSubSalesCY2Q3 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '434')
    .whereBetween('CreateTime', ['2015-07-01 00:00:00', '2015-09-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q3 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};

Member.prototype.sumSubSalesCY2Q4 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '434')
    .whereBetween('CreateTime', ['2015-10-01 00:00:00', '2015-12-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q4 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};

Member.prototype.sumSubSalesCY3Q1 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '434')
    .whereBetween('CreateTime', ['2016-01-01 00:00:00', '2016-03-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q1 ERROR", err);
     cb(new GeneralErrors.Database());
     });

};

Member.prototype.sumSubSalesCY3Q2 = function (cb,sumSubSales) {

  db.select(db.raw('SUM(SubPrice) as SubPrice'))
    .from('saleslist')
    .where('Pro_Id', '=', '434')
    .whereBetween('CreateTime', ['2016-04-01 00:00:00', '2016-06-31 00:00:00'])
    .then(function(result) {
      sumSubSales = result[0].SubPrice;
      //console.log('result'+result);
      cb(null,sumSubSales);
        })
    .catch(function(err) {
     console.log("sumSubSalesAY1Q2 ERROR", err);
     cb(new GeneralErrors.Database());
     });
};




module.exports = Member;
