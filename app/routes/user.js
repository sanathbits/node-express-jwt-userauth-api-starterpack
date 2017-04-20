const async = require('async');


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.set('X-Auth-Required', 'true');
    req.session.returnUrl = req.originalUrl;
    res.redirect('/login/');
}

function authenticationMiddleware () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/login')
    }
}
const user = {
    username: 'user',
    password: 'password',
    id: 1
};



module.exports = function(app, passport) {

    app.post('/changepassword',require(__base + 'app/controllers/actor').changePassword);



    app.get('/actor/:id',require(__base + 'app/controllers/actor').getActor);
    app.post('/addactor',require(__base + 'app/controllers/actor').addActor);
    app.post('/registeractor',require(__base + 'app/controllers/actor').registerActor);
    app.post('/editactorprofile',require(__base + 'app/controllers/actor').editActorProfile);

    app.get('/actorallinfo/:id',require(__base + 'app/controllers/actor').getAllActorInfo);

    app.get('/sendverifyemail/:email',require(__base + 'app/controllers/verification').sendVerifyEmail);
    app.get('/verifyemail/:token',require(__base + 'app/controllers/verification').verifyEmail);


    function ensureAuthorized(req, res, next) {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        } else {
            res.send(403);
        }
    }


    app.get('/logout', function(req, res){
        res.redirect('/');
        //TODO complete this route
    });

    app.post('/forgotpassword', function(req, res, next) {
        async.waterfall([
            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function(token, done) {
                req.app.models.Actor.findOne({ email: req.body.email }, function(err, user) {
                    if (!user) {
                        res._response('no user with this email')
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function(err) {
                        done(err, token, user);
                    });
                });
            },
            function(token, user, done) {

                var mailOptions = {
                    to: user.email,
                    from: 'support@castiko.com',
                    subject: 'Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                req.app.utility.emailtransporter.sendMail(mailOptions,function(err, info) {
                    if (err) {
                        winston.log('error', err);
                    } else {
                        winston.log(info);
                        done(err, 'done');

                    }
                });

            }
        ], function(err) {
            if (err) return next(err);
            res._response('done');

        });
    });


    app.post('/resetactor/:token', function(req, res) {
        async.waterfall([
            function(done) {
                req.app.db.models.Actor.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('back');
                    }

                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                });
            },
            function(user, done) {

                var mailOptions = {
                    to: user.email,
                    from: 'support@castiko.com',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                };
                req.app.utility.emailtransporter.sendMail(mailOptions,function(err, info) {
                    if (err) {
                        winston.log('error', err);
                    } else {
                        winston.log(info);
                        done(err, 'done');

                    }
                });
            }
        ], function(err) {
            res._response('done');
        });
    });

};