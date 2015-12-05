// require the sqlite3 package and turn on the verbose option to print 
//  detailed stack traces
var sqlite3 = require('sqlite3').verbose();

// create a new Database object and open the db for create/read/write operations
var db = new sqlite3.Database('../database.db', 
	sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
	function(err) {
		if (err !== null) {
			// database could not be opened
			console.log('error: the SQLite3 database could not be created and/or opened, exiting');
			// fatal error, exit
			process.exit(1);
		}
	});

/*
Asynchronously creates any missing tables in the database to initialize it. If 
 the the database has been initialized sucessfully, cb is called with the 
 argument null, otherwise cb is called with a non-null argument.
*/
var initialize = function(cb) {
	createTables(cb);
};

/* 
Asynchronously closes the database connection. If the database is successfully
 closed, cb is called with the argument null, otherwise cb is called with a 
 non-null argument.
 @params cb	A function with one parameter 
*/
var close = function(cb) {
	db.close(cb);
};

var addUser = function(user, cb) {
	db.serialize(function() {
		var stmt = db.prepare('INSERT INTO users VALUES (?)');
		stmt.run(1);
		stmt.run(user.getFirstName());
		stmt.run(user.getLastName());
		stmt.run(user.getEmail());
		stmt.run(1);
		stmt.run('newuserkey');
		stmt.run(user.getUsername());
		stmt.run(user.getPhoneNumber());
		stmt.finalize();
	});
};

function createTables(cb) {
	db.serialize(function() {
		db.run('CREATE TABLE users (\
			uid INTEGER PRIMARY KEY NOT NULL,\
			firstname TEXT NOT NULL,\
			lastname TEXT NOT NULL,\
			email TEXT NOT NULL,\
			permissionlevel INTEGER NOT NULL,\
			userkey BLOB,\
			username TEXT NOT NULL,\
			phonenumber TEXT NOT NULL\
			)', [],
			function(err) {
				cb(err);
			});
		// ... create other tables
	});
}

module.exports = {
	initialize : initialize,
	addUser : addUser,
	close : close
};
