var db = require('../libs/db');
var GeneralErrors = require('../errors/GeneralErrors');

var WorkList = function(options) {
    this.id = options.id;
    this.CarId = options.CarId;
    this.Miles = options.Miles;
    this.Status = options.Status;
    this.InDate = options.InDate;
    this.CName = options.CName;
    this.carBrand = options.carBrand;
    this.carType = options.carType;
    this.MQuantity = options.MQuantity;
    this.Price = options.Price;
    this.Amount = options.Amount;
    this.MNote = options.MNote;
    this.Part = options.Part;
    this.Wrong = options.Wrong;
    this.ExpectDate = options.ExpectDate;
    this.situation = options.situation;
    this.frequency = options.frequency;
    this.position = options.position;
    this.note = options.note;
    this.maintenance = options.maintenance;
    this.Question = options.Question;
};

//工單管理--清單
WorkList.prototype.WorkList = function(cb) {
    var subquery = db.select('CarId').from('worklist');

    db.select('customer.CName', 'worklist.WorkId', 'worklist.CarId', 'worklist.Status')
        .from('car')
        .innerJoin('customer', 'car.ID', '=', 'customer.ID')
        .innerJoin('worklist', 'car.CarId', '=', 'worklist.CarId')
        .whereIn('worklist.Status', ['未確認', '已交車'])
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
                'worklist.Status', 'worklist.InDate', 'customer.Tell1',
                'customer.Tell2', 'customer.Address', 'customer.Contact_Person',
                'customer.UniformNum', 'customer.CBirthDate', 'customer.CName',
                'car.cc', 'car.EngineNum', 'car.CarBodyNum', 'car.YrOfManu',
                'carbrand.carBrand', 'cartype.carType', 'wagelist.WContect',
                'wagelist.Wages', 'wagelist.WhoFix', 'wagelist.WhoCheck',
                'wagelist.WNote')
            .from('car')
            .innerJoin('customer', 'car.ID', '=', 'customer.ID')
            .innerJoin('worklist', 'car.CarId', '=', 'worklist.CarId')
            .innerJoin('carbrand', 'car.BrandID', '=', 'carbrand.ID')
            .innerJoin('cartype', 'car.TypeID', '=', 'cartype.ID')
            .innerJoin('wagelist', 'wagelist.WorkId', '=', 'worklist.WorkId')
            .where('worklist.WorkId', this.id)
            .then(function(upWorklist) {
                cb(null, upWorklist);
            }.bind(this))
            .catch(function(err) {

                console.log("WorkList find", err);
                cb(new GeneralErrors.Database());
            });
    }
    //在工單總表點編輯--材料登錄
WorkList.prototype.materiallist = function(cb) {
        console.log("this.id"+this.id);
        db.select('materiallist.Id', 'materiallist.MatId', 'materiallist.MQuantity', 'materiallist.Amount', 'materiallist.Price', 'materiallist.WhoFix', 'materiallist.WhoCheck', 'materiallist.Fix', 'materiallist.Finished', 'materiallist.MNote', 'product.PName')
            .from('materiallist')
            .innerJoin('worklist', 'materiallist.WorkId', '=', 'worklist.WorkId')
            .innerJoin('product', 'materiallist.Id', '=', 'product.Id')
            .where('worklist.WorkId', this.id)
            .then(function(materiallist) {
                cb(null, materiallist);
            }.bind(this))
            .catch(function(err) {

                console.log("materiallist find", err);
                cb(new GeneralErrors.Database());
            });
    }
    //新增材料登錄
    WorkList.prototype.insertMat = function(WorkId,cb) {

        db.from('materiallist')
            .insert({
                WorkId : WorkId,
                MatId : 31,
                Id : "ruv",
                MQuantity: this.MQuantity,
                Price: this.Price,
                Amount: this.Amount,
                MNote: this.MNote
            })
            .catch(function(err) {
                console.log("insertMat find", err);
                cb(new GeneralErrors.Database());
            });
    }


    //每一筆材料登錄更新
WorkList.prototype.saveMat = function(cb) {
    console.log(this.MQuantity);
    db.from('materiallist')
        .where('MatId', this.id)
        .update({
            MQuantity: this.MQuantity
            // Price: this.Price,
            // Amount: this.Amount,
            // MNote: this.MNote
        })
        .catch(function(err) {
            console.log("saveMat find", err);
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
WorkList.prototype.fixModel = function(cb) {
  console.log('model/fixModel');
    db.select('product.PName','materiallist.Id', 'materiallist.MQuantity', 'materiallist.Amount', 'materiallist.Price', 'materiallist.MNote')
        .from('materiallist')
        .innerJoin('product', 'materiallist.Id', '=', 'product.Id')
        .innerJoin('worklist', 'materiallist.WorkId', '=', 'worklist.WorkId')
        .where('worklist.Question', 'like', '小保養')
        .then(function(materiallist) {
          console.log('materiallist[0].Id'+materiallist[0].Id);
            cb(null, materiallist);
        }.bind(this))
        .catch(function(err) {
            console.log("fixModel", err);
            cb(new GeneralErrors.Database());
        });

};
//每一筆材料登錄新增
WorkList.prototype.insertNewMaterial = function(WorkId,materiallist,cb) {
console.log('materiallist.MQuantity'+materiallist.MQuantity);
    db.from('materiallist')

        .insert({
            WorkId : WorkId,
            Id : materiallist.Id,
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


//存Info資料
WorkList.prototype.InfoList = function(cb) {
    console.log("InfoList");
    console.log("this CarId " + this.CarId);
    console.log("this InDate " + this.InDate);

    db("worklist")
        .insert({
            CarId: this.CarId,
            Miles: this.Miles,
            InDate: this.InDate,
            ExpectDate: this.ExpectDate,
        })
        .then(function(result){
        WorkId = result;
        console.log('WorkId'+WorkId);
          cb(null, WorkId);
        })
        .catch(function(err) {
            console.log("INSERT ERROR", err);
            cb(new GeneralErrors.Database());
        });
};

//存Question資料
// WorkList.prototype.QuestionList = function(WorklistID, cb) {
WorkList.prototype.QuestionList = function(WorkId,cb) {
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

module.exports = WorkList;
