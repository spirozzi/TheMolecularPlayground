////////////////////////////////////////
// All 'require's for libraries/packages
////////////////////////////////////////

// node.js web framework: Express
var express	= require('express');

// Express middleware:
var path = require('path'); // join file path strings
var morgan = require('morgan'); // HTTP request logger
var session = require('express-session'); // session support
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
    httpOnly: false,
		maxAge: null // cookie is a "session cookie" and expires when browser is closed
	}
}));

var addLoggedInUser = function(useridpair) {
	sessions.push(useridpair);
};

/*
Returns true if there is a logged in user with a session ID equal to the
 sessionid argument. Returns false otherwise.
*/
var hasSessionId = function(sessionid) {
	for (var i = 0; i < sessions.length; i++) {
		if (sessions[i].id === sessionid) {
			return true;
		}
	}
	return false;
};

/*
Returns the username corresponding to the given session ID. If there is no 
 such username, returns null.
*/
var getUsernameFromSessionId = function(sessionid) {
	for (var i = 0; i < sessions.length; i++) {
		if (sessions[i].id === sessionid) {
			return sessions[i].user;
		}
	}
	return null;
}

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
	app: app,
	server: server,
	io: socketioinstance,
	env: currenv,
	addLoggedInUser: addLoggedInUser,
	hasSessionId: hasSessionId,
	getUsernameFromSessionId, getUsernameFromSessionId
};

// set up custom route handling; must be set up after exports are defined and 
//  after all other middleware is set up
var routehandler = require('./routes/routehandler');
app.use('/', routehandler);
// set up socket.io connection handler/socket event handlers
// sockethandler.js will modify the exported 'io' socket.io instance to
//  add socket connection and event handlers
var socketio = require('./sockets/sockethandler');
