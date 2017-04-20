'use strict';

module.exports = function(app, mongoose) {
    var UserSchema = new mongoose.Schema({
        email: { type: String, unique: true },
        password: { type: String },
        phoneNumber:{type:Number,required:true, unique:[true, "phonenumber must be unique"]},
        userType: { type: String, required: true, default: "user" },
        resetPasswordToken: String,
        emailVerificationCode: String,
        resetPasswordExpires: Date,
        emailVerificationStatus: { type: Boolean, required: true, default: false },
        token: String,
        facebook: {
            facebookid:String,
            facebooktoken: String
        },
        google: {
            googleid:String,
            googletoken: String
        },
        twitter: {
            twitterid:String,
            twittertoken: String
        },
        instagram: {
            instagramid:String,
            instagramtoken: String
        },
        name: String,
        customurl: { type: String, required:false, unique:true},
        photos: {type: Array},
        profilePhoto: String,
        socialLinks:{
            facebook: String,
            google: String,
            instagram: String
        }
    });

    UserSchema.plugin(require('./plugins/pagedFind'));
    UserSchema.index({ name: 1 });
    UserSchema.set('autoIndex', (app.get('env') === 'development'));

    //compare password
    UserSchema.methods.comparePassword = function(candidatePassword, cb) {
        app.bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    };

    //     // checking if password is valid
    // ActorSchema.methods.validPassword = function(password) {
    //     return app.bcrypt.compareSync(password, this.password);
    // };
    // //compare password



    UserSchema.pre('save', function(next) {
        console.log('presave');
        var user = this;
        var SALT_FACTOR = 5;

        if (!user.isModified('password')) return next();

        app.bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
            if (err) return next(err);

            app.bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    });

    app.db.model('User', UserSchema);

};

