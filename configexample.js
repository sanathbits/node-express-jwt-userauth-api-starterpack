'use strict';


exports.port = process.env.PORT || 3000;
exports.mongodb = {
    uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://user:password@ds157078.mlab.com:57078/db'

};
exports.jwtSecret = 'k3yb0ardc4t';
exports.companyName = 'Sanath';
exports.cryptoKey = 'k3yb0ardc4t';
exports.loginAttempts = {
    forIp: 50,
    forIpAndUser: 7,
    logExpiration: '20m'
};
exports.requireAccountVerification = false;
exports.mailchimpAPIkey = '';
exports.mandrillappAPIkey = '';
exports.winstonlogger = {
    token : '951c1bcf-31f8-48d3-906c-ab77099c8260',
    subdomain : 'main',
    tags : []
};