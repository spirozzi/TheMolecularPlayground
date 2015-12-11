// require the Express web framework
var express = require('express');
// create the Router object that handles routing clients' HTTP requests
var router = express.Router();
// require main Express server app
var mainapp = require('../index');
// require database accessor
var db = require('../db/dbaccessor');
// require User prototype
var User = require('../db/user');

// TODO: possible https support for server-side responses
//var https = require('https');

// TODO: require SQLite database JS interface
//var db = require('../db/databaseaccessor');

///////////////////////////////////////////////
// Routing handlers for EJS-rendered HTML pages
///////////////////////////////////////////////

router.get('/', function(req, res) {
	res.redirect('/index');
});

router.get('/index', function(req, res) {
	res.render('index');
});

router.get('/test', function(req, res) {
	console.log('sdf');
});

router.post('/usersignup', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var username = req.body.username;
    var phonenumber = req.body.phonenumber;
    var password = req.body.password;
    console.log('Adding new user to database...');
    var user = new User(firstname, lastname, email, username, phonenumber, password);
    db.initialize(function(err) {
        if (err !== null) {
            console.log('error: could not initialize database, exiting');
            console.log(err);
            process.exit(1);
        } else {
            console.log('Database initialization successful');
        }
    });
    db.addUser(user, function(err) {
        if (err !== null) {
            console.log('error: could not add new user to database, exiting');
            console.log(err);
            process.exit(1);
        } else {
            console.log('Added new user to database');
        }
    });
    res.redirect('index');
});



router.post('/userlogin', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var user = new User(null, null, null, username, null, password);
		console.log('login');
    db.logUserIn(user, function (err) {
		console.log('1login');
        if (err !== null) {
					console.log('2login');
            console.log('routehander.js: could not log user in');
            res.render('error', { message: 'Error: Could not log in'});
        } else {
					console.log('3login');
            //res.redirect('index');
        }
    });
});

//////////////////////////////////////////////
// Route handling code for non-existent routes
//////////////////////////////////////////////

// catch 404s and forward to error handler
router.use(function(req, res, next) {
    var err = new Error('404 Not Found');
    err.status = 404;
    next(err);
});

if (mainapp.env === 'development') {
    // error handler for development; renders error.ejs page with stack trace
    router.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else if (mainapp.env === 'production') {
    // error handler for production; no stack trace rendered to error.ejs page
    router.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

module.exports = router;
