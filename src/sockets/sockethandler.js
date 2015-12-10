////////////////////////////////////////////////
//Server-side socket.io connection/event handler
////////////////////////////////////////////////

// import Express app and server from main JS file
var expressapp = require('../index.js');
// modify socket.io support to the Express app's (index.js) server
var socketio = expressapp.io;

//////////////////////////////////////////////////////////////////////
// Event handler for clients' initial cxn to the server with socket.io
//////////////////////////////////////////////////////////////////////

socketio.on('connection', function(socket) {
	// Event handlers for sockets
	socket.on('upload-file', function(data) {
		// store file in database
		var filedata = data.file;
		//db.addContent(filedata)
		// respond to client with upload status: true=success, false=failure
		if (filedata) {
			socket.emit('upload-status', { status: true });
		} else {
			socket.emit('upload-status', { status: false });
		}
	});
});
