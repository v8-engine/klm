const mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'itdb',
    connectionLimit: 20
})
module.exports = pool;