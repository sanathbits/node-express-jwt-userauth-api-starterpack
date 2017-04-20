const uuidV4 = require('uuid/v4');
var request = require('request');

module.exports.sendVerifyEmail = function(req, res){
    var token = uuidV4();
    req.app.db.models.Actor.findOneAndUpdate({ email: req.params.email}, { $set: { emailverificationcode: token }}, function(err, actor) {
        console.log(token);
        console.log(actor);
        var htmlcode = `<p>Click here to verify your email address <a href="http://localhost:4000/verifyemail/`;
        htmlcode += token;
        htmlcode += `">Here</a></p>`;
            // + token + `>Here</a></p>`;
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Support Staff" <support@castiko.com>', // sender address
            to: actor.email, // list of receivers
            subject: 'Email Verification', // Subject line
            text: 'token', // plain text body
            html: htmlcode // html body
        };
        // send mail with defined transport object
        req.app.utility.emailtransporter.sendMail(mailOptions,function(err, info) {
            if (err) {
                console.error(err);
            } else {
                console.log(info);
            }
        });

        //send email
    });

};

module.exports.sendVerifyPhoneNumber = function(req, res){
    var token = uuidV4();
    token = token.slice(0, 4);
    req.app.db.models.Actor.update({ phonenumber: req.params.phonenumber }, { $set: { mobileverificationcode: token }}, function(err, actor) {

        if(!err){
            //send sms
            req.app.utility.sendsms('Your Verification code - ' + token, actor.phonenumber);


        }
        else if(!actor){
            res._response('actor not found');
        }




    });
};

module.exports.verifyEmail = function(req, res){
    console.log('test1');

    req.app.db.models.Actor.findOneAndUpdate({ emailverification: req.params.token}, { $set: { emailverificationstatus: true }}, function(err, actor) {
        //send email
        var htmlcode = '<p>Thank you for Verifying your email address</p>';
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Fred Foo 👻" <support@castiko.com>', // sender address
            to: actor.email, // list of receivers
            subject: 'Email Verification Done', // Subject line
            text: '', // plain text body
            html: htmlcode // html body
        };
        // send mail with defined transport object
        req.app.utility.emailtransporter.sendMail(mailOptions,function(err, info) {
            if (err) {
                console.error(err);
            } else {
                console.log(info);
            }
        });

    });

};

module.exports.verifyPhoneNumber = function(req, res){

    req.app.db.models.Actor.update({ mobileverification: req.body.phonetoken}, { $set: { mobileverificationstatus: true }}, function(err, actor) {
        //send email
        var htmlcode = '<p>Thank you for Verifying your phone number</p>';
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Fred Foo 👻" <support@castiko.com>', // sender address
            to: actor.email, // list of receivers
            subject: 'Phone Verification Done', // Subject line
            text: '', // plain text body
            html: htmlcode // html body
        };
        // send mail with defined transport object
        req.app.transporter.sendMail(mailOptions,function(err, info) {
            if (err) {
                console.error(err);
            } else {
                console.log(info);
            }
        });
    });

};