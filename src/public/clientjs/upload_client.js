// Client-side script for upload.ejs: upload_client.js
$(document).ready(function() {
	///////////////////
	// Global Variables
	///////////////////

	// connect WebSocket interface to server
	var socket = io.connect('http://localhost:3000');
	// stores the file path of the selected file
	var filepath;

	////////////////////////////////////
	// socket.io - WebSockets and Events
	////////////////////////////////////

	// set up socket event handlers
	socket.on('upload-status', function(data) {
		if (data.status) {
			$('#uploadstatus').text('Upload succeeded.');
		} else {
			$('#uploadstatus').text('Upload failed. Please try again.');
		}
	});

	//////////////////////////
	// jQuery - Event Handlers
	//////////////////////////

	// set up change handler for file chooser
	$("input[type='file'][name='filecontainer']").change(function(event) {
		console.log('file chooser change handler invoked');
		var fp = $(this).val();
		if (fp !== undefined && fp !== '') {
			// set global filepath
			filepath = event.target.files[0];
			// parse filename out of filepath
			var filename = fp.split('\\').pop();
			$('#filenamedisplay').text('Filename: ' + filename);
		} else {
			$("input[type='button'][name='removefile']").prop('disabled', true);
		}
	});
	// set up change handler for file chooser (fired when user selects a file or cancels)
	/*
	$("input[type='file'][name='filecontainer']").change(function(event) {
		// set global filepath variable to selected file
		filepath = event.target.files[0];
	});
	*/
	// set up click handler for "Select File..." button
	$("input[type='button'][name='selectfile']").click(function(event) {
		console.log('Select File click handler invoked');
		// trigger file chooser dialog programmatically
		$("input[type='file'][name='filecontainer']").click();
		// enable Remove File button
		$("input[type='button'][name='removefile']").prop('disabled', false);
	});
	// set up click handler for "Remove File..." button
	$("input[type='button'][name='removefile']").click(function(event) {
		console.log('Remove File click handler invoked');
		filepath = undefined;
		$("input[type='file'][name='filecontainer']").val('');
		$('#filenamedisplay').text('Filename: no file selected');
		$(this).attr('disabled', true);
	});
	// handle upload button and file upload
	$("input[type='button'][name='uploadbutton']").click(function(event) {
		console.log('Upload button submit handler invoked');
		if (filepath !== undefined) {
			// get file data
			var reader = new FileReader();
			// function called when file data has been successfully read
			reader.onload = function(e) {
				var rawfiledata = e.target.result;
				socket.emit('upload-file', { file: rawfiledata });
			};
			reader.readAsBinaryString(filepath);
		}
		// remove file
		$("input[type='button'][name='removefile']").click();
		// update status
		$('#uploadstatus').text('Uploading');
	});
});
