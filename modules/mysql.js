var mysql = require('mysql');

/*
 * MySQL Server settings
 */
var connection = mysql.createConnection({
    host: 'mysql',
    user: 'logintest',
    password: 'logintest',
    database: 'logintest'
});

/*
 * Connect to MySQL Server
 */

connection.connect(function (err) {
    if (err) {
        console.error('error connecting mysql: ' + err.stack);
        return;
    }

    console.log('mysql connected as id ' + connection.threadId);
});

module.exports = {
    connection: connection
};