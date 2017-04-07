var express = require('express');
var router = express.Router();
var addWorklist = require('../../models/Worklist');
var Question = require('../../models/Worklist');
var Info = require('../../models/Worklist');


router.get('/', function(req, res) {
    // if(!req.session.member) {
    //   res.redirect('/');
    // }

    var newaddWorklist = new addWorklist({
        SName: req.body.SName,
        Phones: req.body.Phone,
        Contact_Person: req.body.Contact_Person
    });


    res.render('WorkList/addWorkList', {

        member: req.session.member || null
    });

});

//抓到top table
// router.post('/', function(req, res, next) {
//     console.log('req.body.CarId ' + req.body.CarId);
//     var newInfo = new Info({
//         CarId: req.body.CarId,
//         Miles: req.body.Miles,
//         InDate: req.body.InDate,
//         ExpectDate: req.body.ExpectDate
//     });

//     newInfo.InfoList(function(err, InfoList) {
//         console.log(req.body.theForm);
//         res.render('WorkList/addWorkList', {
//             //  Q1List : Q1List,
//             member: req.session.member || null
//         });
//     });
// });

//抓到part
router.post('/', function(req, res, next) {
    console.log('req.body.part' + req.body.Part);
    console.log('req.body.CarId' + req.body.CarId);
    var newQuestion = new Question({
        CarId: req.body.CarId,
        Miles: req.body.Miles,
        InDate: req.body.InDate,
        ExpectDate: req.body.ExpectDate,
        Part: req.body.Part,
        Wrong: req.body.Wrong
    });
    newQuestion.QuestionList(function(err, QuestionList) {
        // if(err){
        //   next(err);
        // }else{
        //   console.log('Q1List'+Q1List);
        //   console.log('Q1List'+Q1List[0].Q1_Mat);
        console.log(req.body.theForm);
        res.render('WorkList/addWorkList', {
            //  Q1List : Q1List,
            member: req.session.member || null
        });
    });
});


module.exports = router;
