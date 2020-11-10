const mysql = require('mysql')

let db =
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        // user: 'pizzauser',
        // password: 'vKtQJM88vZtU8EZm',
        password: 'password',
        database: 'pizzeriadb'
    });

module.exports=db;


