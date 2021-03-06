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

//抓到part
router.post('/', function(req, res, next) {
    console.log('req.body.part' + req.body.Part);
    console.log('req.body.CarId' + req.body.CarId);
    console.log('req.body.situation' + req.body.situation);
    console.log('req.body.maintenance' + req.body.maintenance);
    var newQuestion = new Question({
        CarId: req.body.CarId,
        Miles: req.body.Miles,
        InDate: req.body.InDate,
        ExpectDate: req.body.ExpectDate,
        maintenance: req.body.maintenance || "無",
        situation: req.body.situation || "無",
        frequency: req.body.frequency || "無",
        position: req.body.position || "無",
        note: req.body.note || "無",
        Part: req.body.Part || "無",
        Wrong: req.body.Wrong || "無"
    });

    newQuestion.InfoList(function(err, WorkId) {
        console.log(req.body.theForm);

//待修
        req.session.WorkId = WorkId;
        console.log('req.session.WorkId '+req.session.WorkId);

        // newQuestion.QuestionList(req.session.InfoList, function(err, QuestionList) {
        newQuestion.QuestionList(req.session.WorkId,function(err) {
            // console.log(req.body.theForm);
            newQuestion.WageList(req.session.WorkId,function(err) {
                // console.log(req.body.theForm);

                res.redirect('/workList');

            });

        });

    });
});


module.exports = router;
