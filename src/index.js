////////////////////////////////////////
// All 'require's for libraries/packages
////////////////////////////////////////

// node.js web framework: Express
var express	= require('express');

// Express middleware:
var path = require('path'); // join file path strings
var morgan = require('morgan'); // HTTP request logger
var session = require('express-session'); // session support
var flash = require('connect-flash'); // session temp message storage support
var bodyparser = require('body-parser'); // parses/stores request elements in req.body
// Miscellaneous requires
var genuuid = require('uid2'); // generate UUIDs for users' session IDs

// global array of user session objects. format: [{ user: X, id: X }, ... ]
var sessions = [];

//////////////////////////////////////////
// Express app and middleware setup/config
//////////////////////////////////////////

// initialize the Express application
var app	= express();

// set Express's 'env' variable based on the NODE_ENV env variable's value
// the value of 'env' will be set to either 'production' or 'development'
if (process.env.NODE_ENV === 'production') {
    app.set('env', 'production');
} else if (process.env.NODE_ENV === 'development') {
    app.set('env', 'development');
}
// store the current 'env' variable
var currenv = app.get('env');

// log all HTTP requests to stdout if in development mode
if (app.get('env') === 'development') {
    app.use(morgan('combined'));
} else if (app.get('env') === 'production') {
    morgan = undefined;
}

// set up the EJS view-rendering engine (for serving HTML to browsers)
// @see ejs npm package
app.set('views', path.join(__dirname, 'public/templates'));
app.set('view engine', 'ejs');

// set up static file serving from "public" directory
app.use(express.static('public'));

// set up the body parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
	extended: true
}));

// set up session support
// @see express-session npm package
app.use('/userlogin', session({
	genid: function(req) {
		console.log('index.js: express-session genid function called');
		return genuuid(64); // UUIDs will be used for session IDs
	},
	secret: '23862235709283689420496820',
	saveUninitialized: false,
	resave: false,
	rolling: true,
	unset: 'destroy',
	cookie: {
		secure: false,
		maxAge: null // cookie is a "session cookie" and expires when browser is closed
	}
}));

var addLoggedInUser = function(useridpair) {
	sessions.push(useridpair);
}

/*
Returns the username corresponding to the given session ID
Returns sessionId's corresponding user if the user is logged in
Returns undefined if sessionId does not correspond to a valid logged in user
*/
var getUsername = function(sessionId) {
	for (var i = 0; i < sessions.length; i++) {
		if (sessions[i].id === sessionId) {
			return sessions[i].user;
		}
	}
	return undefined;
}

/*
Returns the session ID corresponding to the given username.
Returns username's session ID if user is logged in
Returns undefined if username is not logged in and lacks valid session ID
*/
var getSessionId = function(username) {
	for (var i = 0; i < sessions.length; i++) {
		if (sessions[i].user === username) {
			return sessions[i].id;
		}
	}
	return undefined;
}

// TODO: set up flash support
// when enabled, all reqs have req.flash(); sends temp msgs via sessions
// @see connect-flash npm package
//app.use(flash());

//////////////////////
// Server startup code
//////////////////////

// start node server, which will listen on port 3000
var server = app.listen(3000, function() {
    console.log('Server started. Listening on port %d', server.address().port);
});
// initialize socket.io
var socketioinstance = require('socket.io')(server);

module.exports = {
	app : app,
	server : server,
	io : socketioinstance,
	env : currenv,
	addLoggedInUser : addLoggedInUser,
	getUsername : getUsername,
	getSessionId : getSessionId
};

// set up custom route handling; must be run after exports are defined
var routehandler = require('./routes/routehandler');
app.use('/', routehandler);
// set up socket.io connection handler/socket event handlers
// sockethandler.js will modify the exported 'io' socket.io instance to
//  add socket connection and event handlers
var socketio = require('./sockets/sockethandler');
