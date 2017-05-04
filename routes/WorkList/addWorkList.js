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
                maintenance: req.body.maintenance,
                situation: req.body.situation,
                frequency: req.body.frequency,
                position: req.body.position,
                note: req.body.note,
                Part: req.body.Part,
                Wrong: req.body.Wrong
            });

            newQuestion.InfoList(function(err, WorklistID) {
                    if (err) {
                        next(err);
                    } else {
                        req.session.worklist2 = WorklistID;
                        console.log('req.body.theForm '+req.body.theForm);

                        newQuestion.QuestionList(req.session.worklist2, function(err) {
                            res.render('WorkList/addWorkList', {
                                //  Q1List : Q1List,
                                member: req.session.member || null
                            });
                        });
                    };
                    });
            });


        module.exports = router;
