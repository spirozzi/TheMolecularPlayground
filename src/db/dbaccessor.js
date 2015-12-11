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
var db;
// the uid that will be assigned to the next user added to the database
var nextuid;
// uid used to log users in
var uid;

/*
Asynchronously creates any missing tables in the database to initialize it. If
 the the database has been initialized sucessfully, cb is called with the
 argument null, otherwise cb is called with a non-null argument.
*/
var initialize = function(cb) {
	try {
		var dbstats = fs.lstatSync(DB_FILE);
		if (dbstats.isFile()) {
			if (db === undefined) {
				db = new sqlite3.Database(DB_FILE,
					sqlite3.OPEN_READWRITE,
					function(err) {
						if (err !== null) {
							// database could not be opened
							console.log('error: the SQLite3 database could not be created and/or opened, exiting');
							process.exit(1);
						}
					});
				cb(null);
			} else {
				cb(null);
			}
		}
	} catch (e) {
		// file does not exist
		db = new sqlite3.Database(DB_FILE,
			sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
			function(err) {
				if (err !== null) {
					// database could not be opened
					console.log('error: the SQLite3 database could not be created and/or opened, exiting');
					process.exit(1);
				}
			});
		createTables(cb);
		cb(null);
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

/*
Logs the specified user in if the specified username/password references a
 valid user in the database.
 Invokes the callback with null if the user exists, otherwise the callback is
 invoked with a string specifying the error that occurred.
*/
var logUserIn = function(user, cb) {
	var username = user.getUsername();
	var password = user.getPassword();
	// get uid of user
	getUserUid(username, password);
	console.log('dbaccessor.logUserIn: username=' + username + ' password=' + password);
	function stopCheck() {
		clearInterval(checkuid);
		console.log('dbaccessor.logUserIn: uid checking disabled');
	}
	var checkuid = setInterval(function() {
		console.log('dbaccessor.logUserIn: checking uid...');
		lock.readLock(function(release) {
			if (uid && uid !== null) {
				stopCheck();
				cb(null);
			} else if (uid === null) {
				cb('error: specified username and password does not exist');
			}
			release();
		});
	}, 50);
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

function getUserUid(username, password) {
	db.serialize(function() {
		db.get("SELECT * FROM users WHERE username=$username AND password=$password",
			{ $username: username, $password: password },
			function(err, row) {
				lock.writeLock(function(release) {
					if (row !== undefined) {
						// row containing user with specified username and password found
						console.log('dbaccessor.getUserUid: username found');
						setUid(row.uid);
						console.log('dbaccessor.getUserUid: set uid to ' + uid);
					} else if (err === null) {
						// no user with specified uid found, but and no error
						setUid(null);
					} else {
						// error
						console.log('dbaccessor.getUserUid: failed to find user in db with specified username and password');
						console.log(err);
					}
					release();
				});
			});
	});
	console.log('sasfasdfasdfasdfasdfdf')
}

function createTables(cb) {
	db.serialize(function() {
		console.log("Creating tables in database...")
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

function setUid(newuid) {
	uid = newuid;
}

module.exports = {
	initialize: initialize,
	addUser: addUser,
	logUserIn: logUserIn,
	close: close
};
