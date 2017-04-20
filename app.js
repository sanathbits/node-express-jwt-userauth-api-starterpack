// var request = require('request');
// var smsapikey = "IPwjpLt1OE8-cFOBWxkB886Il1xFBm3S07QTHPqspM";
//
//     var Form = {
//         'username' : 'shiv@castiko.com',
//         'apiKey': smsapikey,
//         'numbers': 9867855964,
//         'message' : 'test1',
//         'sender': "CSTIKO"
//     };
module.exports

var http = require('http');
var urlencode = require('urlencode');
var msg=urlencode('Dear Actor, testPowered By. Castiko');
var number='9867855964';
var username='shiv@castiko.com';
var hash='584c2eea2385af2421e30efa109d5039cd107e94'; // The hash key could be found under Help->All Documentation->Your hash key. Alternatively you can use your Textlocal password in plain text.
var sender='TXTLCL';
var data='username='+username+'&hash='+hash+'&sender='+sender+'&numbers='+number+'&message='+msg;
var options = {
    host: 'api.textlocal.in',
    path: '/send?'+data
};
callback = function(response) {
    var str = '';
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
        str += chunk;
    });
    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
        console.log(str);
    });
}
//console.log('hello js'))
http.request(options, callback).end();
//url encode instalation need to use $ npm install urlencode



// request.post({url:'http://api.txtlocal.com/send/', form: Form}, function(err,httpResponse,body){
    //     console.log(body);
    //     console.log(err);
    //     console.log(httpResponse);
    //
    // })

// request({
//     url: "http://api.txtlocal.com/send/",
//     method: "POST",
//     json: true,   // <--Very important!!!
//     body: Form
// }, function (error, response, body){
//     console.log(response);
//     console.log(body);
//     console.log(error);
//
//
// });