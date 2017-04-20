'use strict';

module.exports = function(app, mongoose) {
  //embeddable docs first
    require('./schema/User')(app, mongoose);
    require('./schema/Messages')(app, mongoose);
    // require('./schema/Casting')(app,mongoose);
};