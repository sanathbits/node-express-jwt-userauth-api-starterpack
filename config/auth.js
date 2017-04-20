// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '821513281320688', // your App ID
        'clientSecret'  : '66e7fe6c32a1b9350e579a55a229d6a4', // your App Secret
        'callbackURL'   : 'http://localhost:3100/auth/facebook/callback'
    },

    'googleAuth' : {
    'clientID'      : '752043657191-3crn64a10fbcb20hfi9b3l8lo8i76sn7.apps.googleusercontent.com',
        'clientSecret'  : 'xSPLPRnxzCiEmq9WJbuE-p0y',
        'callbackURL'   : 'http://localhost:3100/auth/google/callback'
}
}