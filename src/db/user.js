var methods = User.prototype;

function User(firstname, lastname, email, username, phonenumber, password) {
	this._firstname = firstname;
	this._lastname = lastname;
	this._email = email;
	this._username = username;
	this._phonenumber = phonenumber;
	this._password = password;
}

methods.getFirstName = function() {
	return this._firstname;
};

methods.getLastName = function() {
	return this._lastname;
};

methods.getEmail = function() {
	return this._email;
};

methods.getUsername = function() {
	return this._username;
};

methods.getPhoneNumber = function() {
	return this._phonenumber;
};

methods.getPassword = function() {
	return this._password;
};

module.exports = User;
