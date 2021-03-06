/*
  Messaging Component: Web App

  key environment variables:
    NODE_ENV

*/


// node module dependencies

var express = require('express')
  , path = require('path')
  , bodyParser = require('body-parser')
  , favicon = require('serve-favicon')
  , methodOverride = require('method-override')
  , multer = require('multer')
  , errorHandler = require('errorhandler')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
;

// express app
var app = express();

/*
  application config file
*/


// set up the environment-based config
var Config = require('./lib/config');
var config = (new Config({ env: global.process.env.NODE_ENV })).config;

// init the context
var Context = require('./lib/context');
msgService = new Context({ config: config });


// http configurations
app.set('port', config.web.port);
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

// session and auth config
app.use(cookieParser(config.web.COOKIE_SECRET));

// development only
if (app.get('env') == 'development') {
  console.log('Running in developent mode!');
  
  app.use(errorHandler());
}

// static files
app.use(express.static(path.join(__dirname, '/public')));

//routes
var RouterCfg = require('./express_router');
routerCfg = new RouterCfg({ context: msgService, expressApp: app })
app.use('/', routerCfg.router);

// start it up
var server = app.listen(process.env.NODE_PORT || config.web.port, function() {
  var host = server.address().address
  var port = server.address().port
  console.log('Express 4 server listening at http://%s:%s', host, port);
});
