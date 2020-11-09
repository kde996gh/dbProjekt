//let db = require('./dbconnect');
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');








var userCheck =function(user,password){
    console.log("user: ", user);
    console.log("password: ", password);
    var hoxx  = 0;
    let db =
        mysql.createConnection({
            host: 'localhost',
            user: 'root',
            // user: 'pizzauser',
            // password: 'vKtQJM88vZtU8EZm',
            password: 'password',
            database: 'pizzeriadb'
        });
   // let personList = [];
  //  db.connect();

		db.query('SELECT username, password FROM user WHERE username = ? AND password = ?', [user, password], function(error, results, fields) {
            console.log("Result: ", results);
            console.log("Result length: ", results.length);
		    if(results.length > 0)
				hoxx = 1;
		});
		console.log("hoxx: ", hoxx)
	//	db.end();
  //  console.log("visszateresi ertek: ", hm);
  //  return hm;
}

//console.log("Fuggveny eredmenye: ",userCheck('tamas55', 'asd123'));




  /*
    db.query("SELECT username, password FROM user", function (err, rows, fields) {
    //connection.query("SELECT * FROM user", function (err, rows, fields) {

        for (let i = 0; i < rows.length; i++) {
            let person = {
                'username': rows[i].username,
                'password': rows[i].password
            }
            personList.push(person);
        }
        console.log(personList);
    });
    db.end()
    console.log(user,password)
    if(user==="asd" && password==="asd"){
        return true;
    }
    else{
        return false;
    }*/

module.exports=userCheck;