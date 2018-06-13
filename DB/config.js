var mysql = require('mysql');
var config = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dbcommtrackv2',
    multipleStatements: true,
});

var fabos = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'fabos',
    multipleStatements: true,
});

config.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

fabos.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = { config, fabos };