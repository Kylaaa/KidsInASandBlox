const mysql = require('mysql');
const dbConfig = require('../config/db.config.json');

const fs = require('fs');

const connection = mysql.createConnection(dbConfig);
connection.connect(function(err){
	if (err){
		throw err;
	};

	console.log("connected");
});

// create the appropriate schema

module.exports = con