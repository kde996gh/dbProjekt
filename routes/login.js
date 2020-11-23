var express = require('express');
var router = express.Router();
//var userCheck = require('../authenticate/userCheck');
const mysql = require('mysql')
const db = require('../authenticate/dbconnect');
/*
let db =
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        // user: 'pizzauser',
        // password: 'vKtQJM88vZtU8EZm',
        password: 'password',
        database: 'pizzeriadb'
    });*/


router.get('/', function(req, res, next) {
    res.render(  'login',{title: 'Bejelentkezés',
                                        message : ''})
});


router.post('/', function(req, res, next){
    const email = req.body.email;
    const password = req.body.password;

    let userLoggedin = {
        email : req.body.email,
        password : req.body.password
    };
    let logQuery = 'SELECT email, password FROM users WHERE ?';
    //        let regQuery = `INSERT INTO users SET ?`;

    //db.query(logQuery, userLoggedin, function(error, results, fields) {
        db.query('SELECT email, password FROM users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
        //console.log("Result: ", results);
        //console.log("Result length: ", results.length);
        if(results.length > 0) {

                req.session.isLoggedIn = true;
            req.session.user = email;
            req.session.isAdmin = (email == "admin@pizzadenk.com") ? true : false;
            if(req.session.isAdmin)
                res.redirect("/personal");
            else
                res.redirect("/");

        }else {
            //req.session.errorMessage = 'Hibás felhasználónév vagy jelszó!';
          // res.send('Incorrect Username and/or Password!');
            res.render('login', {
                msg: 'Hibás jelszó vagy email cim',
                title : 'Bejelentkezés'
            });
        }




    });






});



module.exports = router;