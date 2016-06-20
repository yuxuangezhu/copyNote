var connection = {
	host: '',//远程MySQL数据库的ip地址
	user: '',
	password: '',
	database: '',
	port: '3306'
};
var mysql = require('mysql');

var pool  = mysql.createPool({
	connectionLimit: 10,
	host: connection.host,
	user: connection.user,
	password: connection.password,
	database: connection.database,
	port: connection.port,
	dateStrings: true,
	supportBigNumbers: true,
	bigNumberStrings: true,
	multipleStatements: true
});

pool.doQuery = function(sql, callback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			callback({
				data: err,
				code: 'A00001'
			});
		}

		var query = connection.query(sql, function(err, rows, fields) {
			if (err) {
				callback({
					data: err,
					code: 'A00001'
				});
			}
			if (typeof callback == 'function') {
				callback({
					data: {
						rows: rows,
						fields: fields
					},
					code: 'A00000'
				});
			}
			connection.release();
		});
	});
};

module.exports = pool;