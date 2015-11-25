////////////////////////////////////////
// All 'require's for libraries/packages
////////////////////////////////////////

// node.js web framework: Express
var express	= require('express');

// session support for Express
var session	= require('express-session');

// support to 'flash' data from one route to another
var flash = require('connect-flash');

// Express middleware:
var path = require('path');
var favicon	= require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// user-defined routes
var routehandler = require('./routes/routehandler');

// TODO: add SQLite database JS interface
//var db = require('./lib/db');

//////////////////////////////////////////////
// Express web app middleware setup and config
//////////////////////////////////////////////

// create the Express application
var app	= express();

// set up the dynamic view-rendering engine
// @see ejs npm package
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// TODO: add favicon support
// @see serve-favicon npm package
//app.use(favicon(__dirname + '/public/img/favicon.ico'));

// TODO: add logging support
//app.use(logger('dev'));

// automatically serve *.html pages in the ./public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// TODO: add session support
//app.use(session({ secret: 'tmp-server', saveUninitialized: true,
//	resave: true }));

// TODO: add flash support
// @see connect-flash npm package
//app.use(flash());

// route handling support
app.use('/', routehandler);
//app.use('/otherroute', otherroutehandler);

//////////////////////////////
// Missing route handling code
//////////////////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler for development; will print stack trace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// error handler for production; no stack traces leaked to client
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//////////////////////
// Server startup code
//////////////////////

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
// initialize socket.io
var io = require('socket.io')(server);

// export the Express app
module.exports = {
    'app': app,
    'server' : server
};

// setup socket.io connection/event handler
var socketio = require('./lib/sockethandler');
