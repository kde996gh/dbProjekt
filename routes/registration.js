const express = require('express');
const router = express.Router();
const mysql = require('mysql')

const db = require('../authenticate/dbconnect');

router.get('/', function(req,res,next){
    res.render(  'registration',{title: 'Regisztráció' });

});

router.post('/', function(req,res,next){
    const password1 = req.body.password;
    const password2 = req.body.password2;

    // jelszo ellenorzes
    if(password1 != password2){
        return res.render('registration', {
            title : 'Regisztráció',
            msgReg : 'A beirt jelszavak nem egyeznek!'});
    }else {
        //sqlhez user osztraly letrehozasa
        let userCrate = {
            email : req.body.email,
            password : req.body.password,
            nameirl : req.body.nameirl,
            phone : req.body.phone,
            city : req.body.city,
            street : req.body.street,
            adnumber : req.body.adnumber,
            floorbell : req.body.floorbell,
            isAdmin : 0
        };

        // letezo email ellenorzese
        db.query('SELECT * FROM users WHERE email = ?', [req.body.email], function (error, results, fields) {
            if (error) {
                return console.log(error)
            }//ha nem letezik
            if (!results.length) {
                // felhasznalo beszurasa a users tablaba
                db.query('INSERT INTO users SET ?', userCrate, function (error, results, fields) {
                    if (error) {
                        return console.error(error.message);
                    }
                    res.render("login", {
                        title : 'Bejelentkezés',
                        msg : 'Sikeres regisztráció! Jelentkezz be'});
                });
            } else {
                return res.render('registration', {
                    title : 'Regisztráció',
                    msgReg : 'Az email cím foglalt!'});
            }
        });
    }
});

module.exports = router;