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

///////////////////////////////////////////////
// Routing handlers for EJS-rendered HTML pages
///////////////////////////////////////////////

router.get('/', function(req, res) {
	res.redirect('/index');
});

router.get('/index', function(req, res) {
	res.render('index');
});

router.get('/upload', function(req, res) {
	db.initialize(function(err) {
		if (err !== null) {
			console.log('error: could not initialize database, exiting');
			console.log(err);
			process.exit(1);
		} else {
			console.log('Database initialization successful');
		}
	});
	res.render('upload');
});

router.post('/usersignup', function(req, res) {
	console.log('routehandler.js: POST /usersignup route invoked');
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
});

router.post('/userlogin', function(req, res) {
	console.log('routehandler.js: POST /userlogin route invoked');
	var username = req.body.username;
	var password = req.body.password;
	if (!username || !password) {
		console.log('routehander.js: username or password is undefined');
		res.render('error', { message: 'Error: Could not log in'});
	}
	var user = new User(null, null, null, username, null, password);
	db.initialize(function(err) {
		if (err !== null) {
			console.log('error: could not initialize database, exiting');
			console.log(err);
			process.exit(1);
		} else {
			console.log('Database initialization successful');
		}
	});
	db.logUserIn(user, function (err) {
		if (err !== null) {
			console.log('routehander.js: could not log user in');
			console.log(err);
			req.session.destroy(function(err) {
				if (err) {
					console.log('routehandler.js: could not destroy session');
				}
			});
			res.render('error', { message: 'Error: Could not log in' });
		} else {
			mainapp.addLoggedInUser({
				user: username,
				id: req.connect.sid
			});
			res.redirect('index');
		}
	});
});

///////////////////////////////////
// Route handlers for ajax requests
///////////////////////////////////

/*
Precondition:
 browser has TMP session cookie with session ID
*/
router.post('/isuserloggedin', function(req, res) {
	var sessionid = req.connect.sid;
	res.setHeader('Content-Type', 'application/json');
	if (mainapp.hasSessionId(sessionid)) {
		res.send(JSON.stringify({ userloggedin: true }));
	} else {
		res.send(JSON.stringify({ userloggedin: false }));
	}
});

/*
Preconditions:
 browser has TMP session cookie with session ID
Sends a JSON response with key 'permissionlevel' and an integer value
 representing the user's permission level. If the user corresponding to the 
 request's session ID is not logged in or does not exist, the permissionlevel 
 key's value is set to undefined instead of an integer.
Permission Levels:
 1 = Global Manager, 2 = Local Manager, 3 = Delegate, 4 = Content Author
*/
router.post('/getuserpermissionlevel', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	var username = mainapp.getUsernameFromSessionId(req.connect.sid);
	if (username === null) {
		// user with specified session ID is either not logged in or does not exist
    	res.send(JSON.stringify({ permissionlevel: undefined }));
	} else {
		db.getPermissionLevel(username, function(err, permissionlevel) {
			if (err) {
				// could not get permission level for user
				console.log('routehander.getuserpermissionlevel: could not retrieve permission level for specified user');
				console.log(err);
				res.send(JSON.stringify({ permissionlevel: undefined }));
			} else {
				res.send(JSON.stringify({ permissionlevel: permissionlevel }));
			}
		});
	}
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
