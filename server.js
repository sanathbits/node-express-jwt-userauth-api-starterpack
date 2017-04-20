const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config.js');
const expressjwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const bodyParser   = require('body-parser');
const winston = require('winston');
const models = require('./models');

require('winston-loggly-bulk');

winston.add(winston.transports.Loggly, {
    token: config.winstonlogger.token,
    subdomain: config.winstonlogger.subdomain,
    tags: config.winstonlogger.tags,
    json: config.winstonlogger.json
});
winston.log('info',"Server Started");
global.winston = winston;
global.__base = __dirname;

var port = config.port;

const app = express();
app.config = config;
app.jwt = jwt;
app.bcrypt = bcrypt;

// Compression middleware (should be placed before express.static)
// app.use(compression({
//     threshold: 512
// }));

// Static files middleware
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// cookieParser should be above session
app.use(cookieParser());


//setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
    console.log(config.mongodb.uri);
    //and... we have a data store
});

//config data models
models(app, mongoose);

// Bootstrap routes
require('./config/express')(app);


/**
 * Expose
 */

module.exports = {
    app
};


// Settings

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');

//setup utilities
app.utility = {};
app.utility.emailtransporter = require('./util/sendmail');
app.utility.workflow = require('./util/workflow');
app.utility.mailchimp = require('./util/mailchimp')(config.mailchimpAPIkey);





//========================= JWT AUTH===========================================================================//

//block admin routes
app.all('/user/*', expressjwt({secret:config.jwtSecret}));

require('./app/routes')(app, passport);


app.get('*', function(req, res) {res.send('no API endpoint found');});

app.listen(port);
console.log('The magic happens on port ' + port);