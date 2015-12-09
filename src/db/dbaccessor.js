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
			// create database file and tables if it does not already exist
			createTables(cb);
		}
	} catch (e) {
		console.log('error: database existence check failed, exiting');
		console.log(e);
		process.exit(1);
	}
};

var addUser = function(user, cb) {
	db.serialize(function() {
		lock.writeLock(function(release) {
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
				password = user.getPassword();
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

var logUserIn = function(user, cb) {
	var username = user.getUsername();
	var password = user.getPassword();
	// get uid of user
	var uid;
	var setUid = function(val) {
		uid = val;
	};
	lock.writeLock(function(release) {
		getUserUid(username, setUid)
		release();
	});
	lock.writeLock(function(release) {
		lock.readLock(function(release) {
			if (uid === undefined) {
				cb('user does not exist');
			} else {

			}
			release();
		});
		release();
	});
};

/* 
Asynchronously closes the database connection. If the database is successfully
 closed, cb is called with the argument null, otherwise cb is called with a 
 non-null argument.
 @params cb	A function with one parameter 
*/
var close = function(cb) {
	lock.writeLock(function(release) {
		db.serialize(function() {
			lock.writeLock(function(release) {
				db.close(cb);
				release();
			});
		});
		release();
	});
};

function getUserUid(uid, cbSetUid) {
	lock.writeLock(function(release) {
		db.serialize(function() {
			lock.writeLock(function(release) {
				db.get('SELECT * FROM users WHERE uid=$uid',
					{ $uid: uid },
					function(err, row) {
						lock.writeLock(function(release) {
							if (row !== undefined) {
								// row containing user with specified uid found
								cbSetUid(row.uid);
							} else if (err === null) {
								// no user with specified uid found and no error
								cbSetUid(undefined);
							} else {
								// error
								console.log('error: failed to query db to find user with specified uid');
								console.log(err);
							}
							release();
						});
					});
				release();
			});
		});
		release();
	});
}

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
							// row with largest uid returned
							setNextUid(row.uid + 1);
						} else if (err === null) {
							// no users in table yet and no error
							setNextUid(1);
						} else {
							// error
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
	logUserIn: logUserIn,
	close: close
};
