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

        db.select('materiallist.Id', 'materiallist.MatId', 'materiallist.MQuantity', 'materiallist.Amount', 'materiallist.Price', 'materiallist.WhoFix', 'materiallist.WhoCheck', 'materiallist.Fix', 'materiallist.Finished', 'materiallist.MNote', 'product.PName')
            .from('materiallist')
            .innerJoin('worklist', 'materiallist.WorkId', '=', 'materiallist.WorkId')
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
    //每一筆材料登錄儲存
WorkList.prototype.saveMat = function(cb) {
    console.log(this.MQuantity);
    db.from('materiallist')
        .where('MatId', this.id)
        .update({
            MQuantity: this.MQuantity,
            Price: this.Price,
            Amount: this.Amount,
            MNote: this.MNote
        })
        .catch(function(err) {
            console.log("saveMat find", err);
            cb(new GeneralErrors.Database());
        });
}

//撈Q1
WorkList.prototype.Q1List = function(cb) {
        db.select('Q1_Mat')
            .from('q1')
            .then(function(Q1List) {
                //  console.log('Q1_Mat'+Q1List);
                cb(null, Q1List);
            }.bind(this))
            .catch(function(err) {
                console.log("Q1List", err);
                cb(new GeneralErrors.Database());
            });
    }
    //存Question資料
WorkList.prototype.QuestionList = function(cb) {
    console.log("QuestionList");
    console.log("this part" + this.Part);
    console.log("this Wrong " + this.Wrong);

    db("question")
        .insert({
            Part: this.Part,
            Wrong: this.Wrong,
        })
        .map(function(row) {
            //  this.id = row.id;
            console.log('this' + this.Part);
            this.Part = row.Part;
            this.Wrong = row.Wrong;
            return row;
            console.log('row' + row);
        })
        .then(function(result) {
            console.log('this' + this);
            cb(null, this);
        }.bind(this))
        .catch(function(err) {
            console.log("INSERT ERROR", err);
            cb(new GeneralErrors.Database());
        });
};

module.exports = WorkList;
