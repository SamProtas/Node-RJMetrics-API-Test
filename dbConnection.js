var mysql = require('mysql');
var app_constants = require('./app_constants')();
var db = null;

var HOST = 'localhost';
var MYSQL_USER = 'root';
var DATABASE = 'rjmetrics_test';

module.exports = function() {
	if(!db) {
		db = mysql.createConnection({
			host: HOST,
			user: MYSQL_USER,
			password: app_constants['mysql_password'],
			database: DATABASE
		});
	};
	return db;
};