var jwt = require('jsonwebtoken');

module.exports.changePassword = function (req, res) {
    var password = req.body.password;

    req.app.db.models.Actor.findById(req.body.id , function(err, user) {
        if (!user) {
            res._response('error');
        }
        else if (bcrypt.compareSync(password, user.password)) {
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
                res._response('done');
            })

        }
        else {
            res._response('wrong password');
        }


    });
};



module.exports.registerActor = function (req, res) {
    var actor= {
        name:req.body.name,
        phonenumber: req.body.phonenumber,
        email: req.body.email,
        password: req.body.password,
        customurl: req.body.phonenumber
    };
    console.log(req.body);


    req.app.db.models.Actor.create(actor, function(err,actor){
        console.log(actor);
        if(err){
            console.log(err);
            res.send({status:"error", response: err.errmsg});
            return;
        }
        else{
            res.send({status:"success"});
        }

        var mailchimpapikey = "c7f21e01ec0b65acda9e73cf243e31cc-us15";


    });
};

module.exports.addActor = function (req, res) {
    var actor= {
        name:req.body.name,
        phonenumber: req.body.phonenumber,
        email: req.body.email,
        height: req.body.height,
        sex: req.body.age,
        languages: req.body.languages,
        skills: req.body.skills,
        experiences: req.body.experiences,
        training: req.body.training,
        password: req.body.password
    };

    req.app.db.models.Actor.create(actor,function(err,actor){
        if(err){
            console.log(err);
            res.send({status:"error"});
            return;
        }

        console.log(exp);
        res.send({status:"success",
            response:actor});
    });
};


module.exports.editActorProfile = function (req, res) {
    var actor= {
        name:req.body.name,
        phonenumber: req.body.phonenumber,
        email: req.body.email,
        height: req.body.height,
        sex: req.body.age,
        languages: req.body.languages,
        skills: req.body.skills,
        training: req.body.training,
        photos: req.body.photos,
        profilephoto: req.body.profilephoto,
        minscreenage: req.body.minscreenage,
        maxscreenage: req.body.maxscreenage,
        location: req.body.location,
        zipcode: req.body.zipcode,
        personalwebsite: req.body.personalwebsite
    };

    req.app.db.models.Actor.findByIdAndUpdate(req.body.id, actor,function(err,actor){
        if(err){
            console.log(err);
            res.send({status:"error"});
            return;
        }

        console.log(actor);
        res.send({status:"success",
            response:actor});
    });
};



app.post("/user/login", function(req, res) {
    console.log(req.body);
    if (req.body.phonenumber && req.body.password) {
        var phonenumber = req.body.phonenumber;
        var password = req.body.password;
        // console.log(req.app.db.models);
        req.app.db.models.Actor.findOne({ phonenumber: phonenumber }, function (err, user) {
            console.log(user);
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            if (!user) {
                res.sendStatus(401);
            }

            else if (!req.app.bcrypt.compareSync(password, user.password)) {
                res.sendStatus(401);
            }
            // return done(null, user);
            else{
                if (user) {
                    var payload = {
                        id: user.id,
                        usertype: user.usertype
                    };
                    var token = req.app.jwt.sign(payload, config.jwtSecret);
                    res.json({
                        status: "success",
                        token: token,
                        id: user.id
                    });
                } else {
                    res.sendStatus(401);
                }
            }
        });
    } else {
        res.sendStatus(401);
    }
});