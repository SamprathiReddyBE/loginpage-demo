const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'rootSam@12',
    database: 'auth'
});

console.log("Successfully connected to the database");

module.exports = db;
