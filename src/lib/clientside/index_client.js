$(document).ready(function() {
	// set up socket.io socket handlers
	var socket = io.connect('http://localhost:3000');
	socket.on('update-description', function(data) {
		// angular calls
		$('#description').text(data[text]);
	});
	socket.emit('request-description');
}
