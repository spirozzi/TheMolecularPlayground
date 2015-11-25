/////////////////////////////////////////////////
//Server-side socket.io connection/event handlers
/////////////////////////////////////////////////

// import Express app and server
var app = require('../index.js');
// add socket.io support to the Express app's server
if (app.server !== undefined) {
	console.log('sockethandler.js: server exists');
}
var io = require('socket.io')(app.server);

// define callback functions for socket event handlers
// variable names correspond to the names of the socket event handlers
var request_description = function(socket, req_data) {
	// data param = data from request
	socket.emit('update-description', {text : "NewText" });
};
// ...

// sets up server-side socket event handlers
io.on('connection', function(socket) {
	socket.on('request-description', function(req_data) {
		request_description(socket, req_data);
	});
	// ...
});
