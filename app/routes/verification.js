module.exports = function(app, passport) {

    app.get('/sendverificationemail', require(__base + 'app/controllers/verification').sendVerifyEmail);
    app.get('/sendverificationmessage', require(__base + 'app/controllers/verification').sendVerifyPhoneNumber);

    app.get('/verifyemail/:emailtoken', require(__base + 'app/controllers/verification').verifyEmail);
    app.post('/verifymessage', require(__base + 'app/controllers/verification').verifyPhoneNumber);

};