////////////////////////////////////////////////
//Server-side socket.io connection/event handler
////////////////////////////////////////////////

// import Express app and server from main JS file
var expressapp = require('../index.js');
// modify socket.io support to the Express app's (index.js) server
var socketio = expressapp.io;

//////////////////////////////////////////////////////////////
// Callback functions for socket event handlers
// Variable names correspond to names of socket event handlers
//////////////////////////////////////////////////////////////

/*
function requestDescription(socket, data) {
	socket.emit('update-description', { text : "Text Set by WebSocket" });
};
*/

//////////////////////////////////////////////////////////////////////
// Event handler for clients' initial cxn to the server with socket.io
//////////////////////////////////////////////////////////////////////

socketio.on('connection', function(socket) {
	// Event handlers for sockets
	/*
	socket.on('request-description', function(data) {
		requestDescription(socket, data);
	});
	*/
	// ...
});
