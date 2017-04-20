'use strict';
const Mailchimp = require('mailchimp-api-v3');


var mailchimpmain = function(mailchimpapi){
    return new Mailchimp(mailchimpapi);
};

exports = module.exports = mailchimpmain;
