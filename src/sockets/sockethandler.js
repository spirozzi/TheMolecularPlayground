////////////////////////////////////////////////
//Server-side socket.io connection/event handler
////////////////////////////////////////////////

// import Express app and server from main JS file
var expressapp = require('../index.js');
// require file system module for saving uploaded files locally
var fs = require('fs');
// modify socket.io support to the Express app's (index.js) server
var socketio = expressapp.io;

//////////////////////////////////////////////////////////////////////
// Event handler for clients' initial cxn to the server with socket.io
//////////////////////////////////////////////////////////////////////

socketio.on('connection', function(socket) {
	// Event handlers for sockets
	socket.on('upload-file', function(data) {
		// get file data and filename from data argument
		var buffer = data.file;
		var filename = data.name;
		var filepath = process.env.HOME + '/mols/' + filename;
		// write file to ~/mols/
		fs.open(filepath, 'w', 0666, function(err, fd) {
			if (err) {
				console.log('sockethandler.upload-file: error creating new file to save uploaded file');
				console.log(err);
				socket.emit('upload-status', { status: false });
			} else {
				fs.write(fd, buffer, null, 'Binary', function(err, written, buff) {
					if (err) {
						console.log('sockethandler.upload-file: error saving uploaded file');
						console.log(err);
						socket.emit('upload-status', { status: false });
					} else {
						fs.close(fd, function() {
							console.log('sockethandler.upload-file: successfully saved file to ' + filepath);
							socket.emit('upload-status', { status: true });
						});
					}
				});		
			}
		});
	});
});
