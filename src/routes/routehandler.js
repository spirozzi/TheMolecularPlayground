var express = require('express');

// create the Router object that handles routing clients' HTTP requests
var router = express.Router();

// TODO: possible https support for server-side responses
//var https = require('https');

// TODO: require SQLite database JS interface
//var db = require('../lib/db');

///////////////////////////////////////////////
// Routing handlers for EJS-rendered HTML pages
///////////////////////////////////////////////

router.get('/', function(req, res) {
	res.redirect('/index');
});

router.get('/index', function(req, res) {
	res.render('index');
});

//////////////////////////////////////////////
// Route handling code for non-existent routes
//////////////////////////////////////////////

// catch 404s and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('404 Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    // error handler for development; renders error.ejs page with stack trace
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else if (app.get('env') === 'production') {
    // error handler for production; no stack trace rendered to error.ejs page
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

module.exports = router;
