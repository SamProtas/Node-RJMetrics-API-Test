"use strict";

var https = require('https');
var mysql = require('mysql');

var db = require('./dbConnection')();
var app_constants = require('./app_constants')();

db.query('SELECT * FROM figure_exports',function(err, results){
	if(err){
		throw err;
	};
	getFigs();
})

var options = {
	'host': 'api.rjmetrics.com',
	'port': 443,
	'path': '/0.1/figure',
	'headers': {
		"X-RJM-API-Key": app_constants['api_key']
	}

};

var res_data = '';

function getFigs() {
	var req = https.get(options, function(res) {
		console.log('\nEXPORTS CALL: ')
		console.log("Got response:" + res.statusCode + '\n');

		res.on('data', function(chunk) {
			res_data += chunk;
		});

		res.on('end', function() {
			console.log('Got data! \n');
			storeDate(JSON.parse(res_data));
		});

	});

	req.on('error', function(e) {
	console.log("Got errors: " + e.message);
	});
}



var query = "INSERT INTO figure_exports (id, name, presentation_type, owner_email)" +
	"VALUES (?, ?, ?, ?)"

function storeDate(data) {

	var figures = data.figureExports;

	var failed = 0;
	var succeeded = 0;
	var count = Object.keys(figures).length;

	for (var key in figures) {
		//console.log(key);
		var figure = figures[key];
		db.query(query, [figure['id'], figure['name'], 
			figure['presentationType'], figure['ownerEmail']],
			function(err, results){
			if (err){
				failed++;
			} else {
				succeeded++;
			};
			count--;
			if(count == 0){
				console.log('Succeeded: ' + succeeded);
				console.log('Failed: ' + failed);
			}
		});
	};

	db.end()

}










