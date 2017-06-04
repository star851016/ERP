var express=require('express');
var router = express.Router();
var nodemailer = require("nodemailer");

// var app=express();

/*
	Here we are configuring our SMTP Server details.
	STMP is mail server which is responsible for sending and recieving email.
*/

var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'star851016@gmail.com',
        pass: 'Geajaf$1920118'
    },
    tls: {rejectUnauthorized: false},
    debug:true
});


/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

router.get('/',function(req,res){

	res.render('WorkList/email');
});
router.get('/send',function(req,res){
//  console.log('send');
	var mailOptions={
		to : req.query.to,
		subject : req.query.subject,
		text : req.query.text
	}
	console.log(mailOptions);
	smtpTransport.sendMail(mailOptions, function(error, response){
    console.log('sendMail');
   	 if(error){
        	console.log(error);
		res.end("error");
	 }else{
        	console.log("Message sent: " + response.message);
		res.end("sent");
    	 }
});
});

/*--------------------Routing Over----------------------------*/
module.exports = router;

// app.listen(3000,function(){
// 	console.log("Express Started on Port 3000");
// });
