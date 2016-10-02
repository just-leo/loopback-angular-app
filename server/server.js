'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.disable('x-powered-by');

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// use loopback.context on all routes
app.use(loopback.context());

//To use cookies for authentication
//To allow the current logged in user id for REST APIs
app.use(loopback.token({ model: app.models.AccessToken, currentUserLiteral: 'me' }));

//Remember current user Id per request
app.use(function setCurrentUser(req, res, next) {
  if (!req.accessToken) {
    return next();
  }
    var loopbackContext = loopback.getCurrentContext();
    if (loopbackContext) {
      loopbackContext.set('currentUserId', req.accessToken.userId);
      //console.log('Set user id', req.accessToken.userId)
    } else {
      //console.log('Can not set user id', req.accessToken.userId)
    }
    next();
});

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
