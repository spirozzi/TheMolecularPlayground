var express = require('express');

// the Router object which handles routing clients' HTTP requests
var router = express.Router();

// TODO: https support for server-side responses
//var https = require('https');

// TODO: require SQLite database JS interface
//var db = require('../lib/db');

///////////////
// Routing code
///////////////

router.get('/', function(req, res) {
  res.redirect('/index');
});

router.get('/index', function(req, res) {
  res.render('index');
});

module.exports = router;
