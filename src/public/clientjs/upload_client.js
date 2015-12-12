// Client-side script for upload.ejs: upload_client.js
$(document).ready(function() {
	///////////////////
	// Global Variables
	///////////////////

	// connect WebSocket interface to server
	var socket = io.connect('http://localhost:3000');
	// stores the file path of the selected file
	var filepath;
	// stores only the name of the selected file
	var filename;

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
		var fp = $(this).val();
		if (fp !== undefined && fp !== '') {
			// set global filepath
			filepath = event.target.files[0];
			// parse filename out of filepath
			filename = fp.split('\\').pop();
			$('#filenamedisplay').text('Filename: ' + filename);
		} else {
			$("input[type='button'][name='removefile']").prop('disabled', true);
		}
	});
	// set up click handler for "Select File..." button
	$("input[type='button'][name='selectfile']").click(function(event) {
		// trigger file chooser dialog programmatically
		$("input[type='file'][name='filecontainer']").click();
		// enable Remove File button
		$("input[type='button'][name='removefile']").prop('disabled', false);
	});
	// set up click handler for "Remove File..." button
	$("input[type='button'][name='removefile']").click(function(event) {
		filepath = undefined;
		filename = undefined;
		$("input[type='file'][name='filecontainer']").val('');
		$('#filenamedisplay').text('Filename: no file selected');
		$(this).attr('disabled', true);
	});
	// handle "Upload" button and file upload
	$("input[type='button'][name='uploadbutton']").click(function(event) {
		console.log('Upload button submit handler invoked');
		if (filepath !== undefined) {
			// get file data
			var reader = new FileReader();
			// function called when file data has been successfully read
			reader.onload = function(e) {
				var rawfiledata = e.target.result;
				socket.emit('upload-file', { file: rawfiledata, name: filename });
			};
			console.log(filepath)
			reader.readAsBinaryString(filepath);
		}
		// update status
		$('#uploadstatus').text('Uploading...');
	});
});
