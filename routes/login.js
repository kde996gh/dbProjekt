var express = require('express');
var router = express.Router();
//var userCheck = require('../authenticate/userCheck');
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


router.get('/', function(req, res, next) {
    res.render(  'login',{title: 'Login' });
});


router.post('/', function(req, res, next){
    const username = req.body.username;
    const password = req.body.password;
  // let loginResult = userCheck(username, password);

    db.query('SELECT username, password FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
        console.log("Result: ", results);
        console.log("Result length: ", results.length);
        if(results.length > 0) {
            req.session.isLoggedIn = true;
            req.session.user = username;
            res.redirect("/");
        }else {
            res.send('Incorrect Username and/or Password!');
        }
    });
/*
    if(loginResult){
        req.session.isLoggedIn = true;
        req.session.user = username;
        res.redirect("/")
    }
    else{
        console.log("LOGIN RESULT",loginResult)
        res.send("<h1> Hibas jelszo vagy felhasználónév! </h1>")
    }
*/

});



module.exports = router;