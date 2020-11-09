const mysql = require('mysql')

let dbconnect =
    mysql.createConnection({
        host: 'localhost',
        user: 'pizzauser',
        password: 'vKtQJM88vZtU8EZm',
        database: 'pizzeriadb'
    });

module.exports=dbconnect;


