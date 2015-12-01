////////////////////////////////////////////////
//Server-side socket.io connection/event handler
////////////////////////////////////////////////

// import Express app and server from main JS file
var express = require('../index.js');
// add socket.io support to the Express app's server
var io = express.io;

//////////////////////////////////////////////////////////////
// Callback functions for socket event handlers
// Variable names correspond to names of socket event handlers
//////////////////////////////////////////////////////////////

var request_description = function(socket, data) {
	// XXX: debug
	if (socket === undefined) {
		console.log("request_description: socket is null");
		return;
	}
	socket.emit('update-description', { text : "NewText" });
};


// Event handler for clients' initial cxn to the server with socket.io
io.on('connection', function(socket) {
	// Event handlrs for sockets
	socket.on('request-description', function(data) {
		request_description(socket, data);
	});

});
