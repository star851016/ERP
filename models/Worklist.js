var db = require('../libs/db');
var GeneralErrors = require('../errors/GeneralErrors');

var WorkList = function(options) {
    // this.fixModel = options.fixModel;
    this.MatId = options.MatId;
    this.id = options.id;
    this.CarId = options.CarId;
    this.Miles = options.Miles;
    this.Status = options.Status;
    this.InDate = options.InDate;
    this.CName = options.CName;
    this.carBrand = options.carBrand;
    this.carType = options.carType;
    this.PId = options.PId;
    this.MQuantity = options.MQuantity;
    this.Price = options.Price;
    this.Amount = options.Amount;
    this.MNote = options.MNote;
    this.Fix = options.Fix ;
    this.Finished = options.Finished;
    this.WhoFix = options.WhoFix;
    this.WhoCheck = options.WhoCheck;
    this.Part = options.Part;
    this.Wrong = options.Wrong;
    this.ExpectDate = options.ExpectDate;
    this.situation = options.situation;
    this.frequency = options.frequency;
    this.position = options.position;
    this.note = options.note;
    this.maintenance = options.maintenance;
    this.Question = options.Question;
    this.WageTotal = options.WageTotal,
        this.MaterialTotal = options.MaterialTotal,
        this.PreTaxAmount = options.PreTaxAmount,
        this.Tax = options.Tax,
        this.AccountReceivable = options.AccountReceivable,
        this.RealReceive = options.RealReceive,
        this.discount = options.discount,
        this.WorkId = options.WorkId
};

//工單管理--清單
WorkList.prototype.WorkList = function(cb) {
    var subquery = db.select('CarId').from('worklist');

    db.select('customer.CName', 'worklist.WorkId', 'worklist.CarId', 'worklist.Status')
        .from('car')
        .innerJoin('customer', 'car.ID', '=', 'customer.ID')
        .innerJoin('worklist', 'car.CarId', '=', 'worklist.CarId')
        .whereIn('worklist.Status', ['未確認', '未查修', , '維修中'])
        .whereIn('car.CarId', subquery)

        .then(function(worklist) {
            cb(null, worklist);
        }.bind(this))
        .catch(function(err) {
            console.log("worklist", err);
            cb(new GeneralErrors.Database());
        });

};
//點編輯 找出detail--工單明細
WorkList.prototype.find = function(cb) {
    console.log('this.id' + this.id);
    db.select('worklist.WorkId', 'worklist.CarId', 'worklist.Miles',
            'worklist.Status', 'worklist.InDate','worklist.Question',
            'worklist.ExpectDate',
            'customer.Tell1',
            'customer.Tell2', 'customer.Address', 'customer.Contact_Person',
            'customer.UniformNum', 'customer.CBirthDate', 'customer.CName',
            'car.cc', 'car.EngineNum', 'car.CarBodyNum', 'car.YrOfManu',
             'carbrand.carBrand', 'cartype.carType',
              'wagelist.WContect',
            'wagelist.Wages', 'wagelist.WhoFix', 'wagelist.WhoCheck',
            'wagelist.WNote',
            'question.Part', 'question.Wrong'
          )
        .from('car')
        .innerJoin('customer', 'car.ID', '=', 'customer.ID')
        .innerJoin('worklist', 'car.CarId', '=', 'worklist.CarId')
        .innerJoin('carbrand', 'car.BrandID', '=', 'carbrand.ID')
        .innerJoin('cartype', 'car.TypeID', '=', 'cartype.ID')
        .innerJoin('wagelist', 'wagelist.WorkId', '=', 'worklist.WorkId')
        .innerJoin('question', 'question.WorklistID', '=', 'worklist.WorkId')


        .where('worklist.WorkId', this.id)
        .then(function(upWorklist) {
          console.log('upWorklist[0]'+upWorklist[0]);

            cb(null, upWorklist);
        }.bind(this))
        .catch(function(err) {

            console.log("WorkList find", err);
            cb(new GeneralErrors.Database());
        });
}
//在工單總表點編輯--材料登錄
WorkList.prototype.materiallist = function(cb) {
    console.log("this.id" + this.id);
    db.select('materiallist.Id', 'materiallist.MatId', 'materiallist.MQuantity',
              'materiallist.Amount', 'materiallist.Price', 'materiallist.WhoFix',
               'materiallist.WhoCheck', 'materiallist.Fix', 'materiallist.Finished',
               'materiallist.MNote', 'product.PName'
              //  ,'s1.EName AS ENameFix','s2.EName AS ENameCheck'
             )
        .from('materiallist')
        .innerJoin('worklist', 'materiallist.WorkId', '=', 'worklist.WorkId')
        .innerJoin('product', 'materiallist.Id', '=', 'product.Id')
        // .innerJoin('employee AS s1','s1.EmployeeId', '=', 'materiallist.WhoFix')
        // .innerJoin('employee AS s2','s2.EmployeeId', '=', 'materiallist.WhoCheck')
        .where('worklist.WorkId', this.id)
        .then(function(materiallist) {
            cb(null, materiallist);
        }.bind(this))
        .catch(function(err) {

            console.log("materiallist find", err);
            cb(new GeneralErrors.Database());
        });
}
//刪除工單
WorkList.prototype.delWorklist= function(WorkId, cb) {
console.log('models');
console.log('WorkId'+WorkId);
    db('worklist')
        .where('WorkId', WorkId)
        .del()
        .then(function(materiallist) {
            cb(null, materiallist);
        }.bind(this))
        .catch(function(err) {
            console.log("delWorkLlist", err);
            cb(new GeneralErrors.Database());
        });
}
//找員工Id
WorkList.prototype.findEmployee = function(cb) {

    db.select('s1.EmployeeId AS EmployeeIdFix','s2.EmployeeId AS EmployeeIdCheck')
        .from('materiallist')
        .innerJoin('employee AS s1','s1.EmployeeId', '=', 'materiallist.WhoFix')
        .innerJoin('employee AS s2','s2.EmployeeId', '=', 'materiallist.WhoCheck')
        .where('worklist.WorkId', this.WhoFix)
        .then(function(materiallist) {
            cb(null, materiallist);
        }.bind(this))
        .catch(function(err) {

            console.log("materiallist find", err);
            cb(new GeneralErrors.Database());
        });
}
//新增材料登錄
WorkList.prototype.insertMat = function(WorkId, cb) {

    db.from('materiallist')
        .insert({
            WorkId: WorkId,
            Id: this.PId  ,
            MQuantity: this.MQuantity ,
            Price: this.Price,
            Amount: this.Amount ,
            MNote: this.MNote  ,
            Fix : this.Fix  ,
            Finished : this.Finished ,
            WhoFix : this.WhoFix ,
            WhoCheck : this.WhoCheck
        })
        .catch(function(err) {
            console.log("insertMat find", err);
            cb(new GeneralErrors.Database());
        });
}


//每一筆材料登錄更新
WorkList.prototype.saveMat = function(cb) {
    console.log(this.MQuantity);
    console.log(this.WhoFix);
    console.log(this.WhoCheck);
    console.log(this.Amount);
    console.log(this.MNote);
    console.log(this.Fix);
    console.log('req.body.impaired'+this.Finished);
    db.from('materiallist')

        .where('MatId', this.id)

        .update({
            MQuantity: this.MQuantity  ,
            Price: this.Price  ,
            Amount: this.Amount  ,
             MNote: this.MNote ,
            WhoFix: this.WhoFix ,
            WhoCheck: this.WhoCheck,
            Fix: this.Fix,
            Finished : this.Finished

        })
        .catch(function(err) {
            console.log("saveMat find", err);
            cb(new GeneralErrors.Database());
        });
}

//每一筆材料登錄刪除
WorkList.prototype.delMat = function(cb) {
    console.log(this.MatId);
    db.from('materiallist')
        .where('MatId', this.MatId)
        .del()
        .then(function(result) {
            cb(null, this);
        }.bind(this))
        .catch(function(err) {
            console.log("delMat ERROR", err);
            cb(new GeneralErrors.Database());
        });
}

//searchPId
//料號查詢
WorkList.prototype.searchPId = function(cb) {
    db.select('product.Id', 'product.PName')
        .from('product')
        .where('Id', 'like', '%' + this.id + '%')
        .then(function(PIdList) {
            console.log('Id' + PIdList[0].Id);
            cb(null, PIdList);
        }.bind(this))
        .catch(function(err) {
            console.log("PIdList", err);
            cb(new GeneralErrors.Database());
        });
}

//保養套組
WorkList.prototype.fixModel = function(fixModel,cb) {
    console.log(fixModel);
    console.log(this.CarId);
    console.log('model/fixModel');
    db.select('product.PName', 'materiallist.Id', 'materiallist.MQuantity', 'materiallist.Amount', 'materiallist.Price', 'materiallist.MNote')
        .from('materiallist')
        .innerJoin('product', 'materiallist.Id', '=', 'product.Id')
        .innerJoin('worklist', 'materiallist.WorkId', '=', 'worklist.WorkId')
        .where({
            'worklist.Question': fixModel,
            'worklist.CarId': this.CarId
        })
        .then(function(materiallist) {
            console.log('materiallist[0].Id' + materiallist[0].Id);
            cb(null, materiallist);
        }.bind(this))
        .catch(function(err) {
            console.log("fixModel", err);
            cb(new GeneralErrors.Database());
        });

};
//每一筆材料登錄新增
WorkList.prototype.insertNewMaterial = function(WorkId, materiallist, cb) {
    console.log('materiallist.MQuantity' + materiallist.MQuantity);
    db.from('materiallist')

        .insert({
            WorkId: WorkId,
            Id: materiallist.Id,
            MQuantity: materiallist.MQuantity,
            Price: materiallist.Price,
            Amount: materiallist.Amount,
            MNote: materiallist.MNote
        })
        .catch(function(err) {
            console.log("insertNewMaterial find", err);
            cb(new GeneralErrors.Database());
        });
}
//編輯工單之客戶問題
WorkList.prototype.getQuestion = function(cb) {
    console.log("this.id" + this.id);
    db.select()
        .from('question')
        .innerJoin('worklist', 'question.WorkId', '=', 'worklist.WorkId')
        .where('worklist.WorkId', this.id)
        .then(function(questionlist) {
            cb(null, questionlist);
        }.bind(this))
        .catch(function(err) {

            console.log("getQuestion ERROR", err);
            cb(new GeneralErrors.Database());
        });
}

//列印帳單
WorkList.prototype.bill = function(cb) {
    console.log('this.id' + this.id);
    db.select(db.raw('SUM(materiallist.Amount) as Amount'))
        .from('worklist')
        .innerJoin('materiallist', 'materiallist.WorkId', '=', 'worklist.WorkId')
        .where('worklist.WorkId', this.id)
        .then(function(result) {
            Amount = result[0].Amount;
            console.log('Amount' + Amount);
            console.log(Amount);
            cb(null, Amount);
        })
        .catch(function(err) {

            console.log("Bill ERROR", err);
            cb(new GeneralErrors.Database());
        });
}
//結算交車 存到資料庫
WorkList.prototype.saveWorklist = function(cb) {

    db.from('worklist')
        .insert({
            WageTotal: this.WageTotal,
            MaterialTotal: this.MaterialTotal,
            PreTaxAmount: this.PreTaxAmount,
            Tax: this.Tax,
            AccountReceivable: this.AccountReceivable,
            RealReceive: this.RealReceive,
            discount: this.discount,

        })

        .where('worklist.WorkId', this.WorkId)
        .then(function(result) {

            cb(null, result);
        })
        .catch(function(err) {
            console.log("saveWorklist ", err);
            cb(new GeneralErrors.Database());
        });
}
//車歷卡
WorkList.prototype.carHistory = function(cb) {
    // console.log('this.id' + this.id);
    db.select()
        .from('car')
        .innerJoin('customer', 'car.ID', '=', 'customer.ID')
        .innerJoin('worklist', 'car.CarId', '=', 'worklist.CarId')

        .where('car.CarId', '5566-TY')
        .then(function(worklist) {

            cb(null, worklist);
        }.bind(this))
        .catch(function(err) {

            console.log("carHistory ERROR", err);
            cb(new GeneralErrors.Database());
        });
}
//車歷卡 車牌搜尋
WorkList.prototype.carHistorySearch = function(CarId, cb) {
    console.log('CarId' + CarId);
    db.select()
        .from('car')
        .innerJoin('customer', 'car.ID', '=', 'customer.ID')
        .innerJoin('worklist', 'car.CarId', '=', 'worklist.CarId')

        .where('car.CarId', CarId)
        .then(function(worklist) {

            cb(null, worklist);
        }.bind(this))
        .catch(function(err) {

            console.log("carHistory ERROR", err);
            cb(new GeneralErrors.Database());
        });
}
//車歷卡細節
WorkList.prototype.carHistoryDetail = function(WorkId, cb) {
    console.log('this.id' + WorkId);
    db.select()
        .from('materiallist')
        .innerJoin('product', 'product.Id', '=', 'materiallist.Id')
        .where('materiallist.WorkId', WorkId)
        .then(function(materiallist) {

            cb(null, materiallist);
        }.bind(this))
        .catch(function(err) {

            console.log("carHistory ERROR", err);
            cb(new GeneralErrors.Database());
        });
}
//材料登錄之比價
WorkList.prototype.searchSupplier = function(searchPId, cb) {
    console.log(searchPId);
    db.select('compare.Pur_Price','supplier.SName','compare.compareId')
        .from('compare')
        .innerJoin('product', 'compare.Id', '=', 'product.Id')
        .innerJoin('supplier', 'compare.Sid', '=', 'supplier.id')
        .where('product.Id', searchPId)
        .then(function(result) {

            cb(null, result);
        })
        .catch(function(err) {

            console.log("searchSupplier ERROR", err);
            cb(new GeneralErrors.Database());
        });
}


//存Info資料
WorkList.prototype.InfoList = function(cb) {
    console.log("InfoList");
    console.log("this CarId " + this.CarId);
    console.log("this InDate " + this.InDate);
    console.log("this part" + this.Part);
    console.log("this situation " + this.situation);
    console.log("this Wrong " + this.Wrong);
    console.log("this maintenance " + this.maintenance);
    var question = this.situation +"/" + this.frequency  +"/" + this.position  +"/" + this.Part  +"/" + this.Wrong +"/"+ this.note + "/" + this.maintenance ;
    console.log('question'+question);
    db("worklist")
        .insert({
            CarId: this.CarId,
            Miles: this.Miles,
            InDate: this.InDate,
            ExpectDate: this.ExpectDate,
            Question : question
        })
        .then(function(result) {
            WorkId = result;
            console.log('WorkId' + WorkId);
            cb(null, WorkId);
        })
        .catch(function(err) {
            console.log("INSERT ERROR", err);
            cb(new GeneralErrors.Database());
        });
};

//存Question資料
// WorkList.prototype.QuestionList = function(WorklistID, cb) {
WorkList.prototype.QuestionList = function(WorkId, cb) {
    console.log("QuestionList");
    console.log("WorklistID" + WorkId);
    console.log("this part" + this.Part);
    console.log("this situation " + this.situation);
    console.log("this Wrong " + this.Wrong);
    console.log("this maintenance " + this.maintenance);


    db("question")
        .insert({
            WorklistID: WorkId,
            Part: this.Part,
            Wrong: this.Wrong,
            Situation: this.situation,
            Frequency: this.frequency,
            Position: this.position,
            Note: this.note,
            Maintenance: this.maintenance
        })
        .then(function(result) {
            cb(null, result);
        }.bind(this))
        .catch(function(err) {
            console.log("INSERT ERROR", err);
            cb(new GeneralErrors.Database());
        });
};

//預設工資登錄
WorkList.prototype.WageList = function(WorkId, cb) {

    db("wagelist")
        .insert({
            WorkId: WorkId
        })
        .then(function(result) {
            cb(null, result);
        }.bind(this))
        .catch(function(err) {
            console.log("INSERT ERROR", err);
            cb(new GeneralErrors.Database());
        });
};
module.exports = WorkList;
