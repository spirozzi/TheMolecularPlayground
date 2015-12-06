// name of database. constant value
const DB_FILE = '../database.db';
// require the sqlite3 package and turn on the verbose option to print 
//  detailed stack traces
var sqlite3 = require('sqlite3').verbose();
// require the fs package to check if files exist
var fs = require('fs');
// require the rwlock package to use read/write locks
var ReadWriteLock = require('rwlock');
// default read/write lock
var lock = new ReadWriteLock();

// create a new Database object and open the db for create/read/write operations
var db = new sqlite3.Database(DB_FILE, 
	sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
	function(err) {
		if (err !== null) {
			// database could not be opened
			console.log('error: the SQLite3 database could not be created and/or opened, exiting');
			process.exit(1);
		}
	});
// the uid that will be assigned to the next user added to the database
var nextuid;

/*
Asynchronously creates any missing tables in the database to initialize it. If 
 the the database has been initialized sucessfully, cb is called with the 
 argument null, otherwise cb is called with a non-null argument.
*/
var initialize = function(cb) {
	try {
		var dbstats = fs.lstatSync(DB_FILE);
		if (!dbstats.isFile()) {
			createTables(cb);
		}
	} catch (e) {
		console.log('error: database existence check failed, exiting');
		console.log(e);
		process.exit(1);
	}
};

/* 
Asynchronously closes the database connection. If the database is successfully
 closed, cb is called with the argument null, otherwise cb is called with a 
 non-null argument.
 @params cb	A function with one parameter 
*/
var close = function(cb) {
	db.serialize(function() {
		db.close(cb);
	});
};

var addUser = function(user, cb) {
	db.serialize(function() {
		lock.writeLock(function(release) {
			console.log('enter writelock 1');
			// write nextuid variable
			generateNextUid();
			release();
		});
		lock.writeLock(function(release) {
			lock.readLock(function(release) {
				firstname = user.getFirstName();
				lastname = user.getLastName();
				email = user.getEmail();
				permissionlevel = 1;
				userkey = 'myuserkey';
				username = user.getUsername();
				phonenumber = user.getPhoneNumber();
				db.run('INSERT INTO users VALUES ($nextuid, $firstname, $lastname, $email, $permissionlevel, $userkey, $username, $phonenumber, $password)', 
					{
						$nextuid: nextuid,
						$firstname: firstname,
						$lastname: lastname,
						$email: email,
						$permissionlevel: permissionlevel,
						$userkey: userkey,
						$username: username,
						$phonenumber: phonenumber,
						$password: password
					},
					function(err) {
						cb(err);
					});
				release();
			});
			release();
		});
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
			phonenumber TEXT NOT NULL,\
			password TEXT NOT NULL)', 
			[],
			function(err) {
				cb(err);
			});
		// TODO: create other tables
	});
}

function generateNextUid() {
	lock.writeLock(function(release) {
		db.serialize(function() {
			lock.writeLock(function(release) {
				db.get('SELECT MAX(uid) FROM users', [], function(err, row) {
					lock.writeLock(function(release) {
						if (row !== undefined) {
							setNextUid(row.uid + 1);
						} else if (err === null) {
							setNextUid(1);
						} else {
							console.log('error: could not read users database table, exiting');
							console.log(err);
							process.exit(1);
						}
						release();
					});
					release();
				});
			});
			release();
		});
	});
}

function setNextUid(uid) {
	nextuid = uid;
}

module.exports = {
	initialize: initialize,
	addUser: addUser,
	close: close
};
