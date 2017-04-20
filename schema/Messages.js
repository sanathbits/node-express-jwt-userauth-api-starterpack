'use strict';

module.exports = function(app, mongoose) {
    var MessageSchema = new mongoose.Schema({
        from : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        to : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: String
    });

    MessageSchema.plugin(require('./plugins/pagedFind'));
    MessageSchema.index({ from: 1 });
    MessageSchema.index({ to: 1 });
    MessageSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('Message', MessageSchema);

};

