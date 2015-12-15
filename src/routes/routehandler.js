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
// set by initialize()
var db;
// the uid that will be assigned to the next user added to the db.
// set/accessed by addUser() and generateNextUid()
var nextuid;
// uid used to log users in
// set/accessed by logUserIn() and getUserUid()
var uid;
// permission level of requested user
// set/accessed by getPermissionLevel() and queryPermissionLevel()
var permissionlevel;

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
				// database already initialized
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
	function stopUidCheck() {
		clearInterval(checkuid);
	}
	var checkuid = setInterval(function() {
		lock.readLock(function(release) {
			if (uid && uid !== null) {
				stopUidCheck();
				setUid(undefined);
				cb(null);
			} else if (uid === null) {
				setUid(undefined);
				cb('error: could not log user in, specified user does not exist');
			}
			release();
		});
	}, 50);
};

/*
Gets the permission level of the given username. If successful, cb is called 
 as cb(null, permissionlevel), otherwise cb is called as cb(errmsg, undefined).
*/
var getPermissionLevel = function(username, cb) {
	queryPermissionLevel(username);
	function stopPermissionCheck() {
		clearInterval(checkpermission);
	}
	var checkpermission = setInterval(function() {
		lock.readLock(function(release) {
			if (permissionlevel && permissionlevel !== null) {
				stopPermissionCheck();
				var tempPermission = permissionlevel;
				setPermissionLevel(undefined);
				cb(null, tempPermission);
			} else if (permissionlevel === null) {
				setPermissionLevel(undefined);
				cb('error: could not get permission level for specified username', undefined);
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
	});
}

function getUserUid(username, password) {
	db.serialize(function() {
		db.get("SELECT * FROM users WHERE username=$username AND password=$password",
			{ $username: username, $password: password },
			function(err, row) {
				lock.writeLock(function(release) {
					if (row !== undefined) {
						// row containing user with specified username and password found
						setUid(row.uid);
					} else if (err === null) {
						// no user with specified uid found, but no error
						setUid(null);
					} else {
						// error
						setUid(null);
						console.log('dbaccessor.getUserUid: failed to find user in db with specified username and password');
						console.log(err);
					}
					release();
				});
			});
	});
}

function queryPermissionLevel(username) {
	db.serialize(function() {
		db.get("SELECT * FROM users WHERE username=$username",
			{ $username: username },
			function(err, row) {
				lock.writeLock(function(release) {
					if (row !== undefined) {
						// row containing user with specified username found
						setPermissionLevel(row.permissionlevel);
					} else if (err === null) {
						// no user with specified username found, but no error
						setPermissionLevel(null);
					} else {
						// error
						setPermissionLevel(null);
						console.log('dbaccessor.queryPermissionLevel: failed to find user in db with specified username');
						console.log(err);
					}
					release();
				});
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

function setPermissionLevel(level) {
	permissionlevel = level;
}

module.exports = {
	initialize: initialize,
	addUser: addUser,
	logUserIn: logUserIn,
	getPermissionLevel: getPermissionLevel,
	close: close
};