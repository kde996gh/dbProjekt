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
            points : 0
        };

        // letezo email ellenorzese
        db.query('SELECT * FROM users WHERE email = ?', [req.body.email], function (error, results, fields) {
            if (error) {
                //  db.end();
                return console.log(error)
            }//ha nem letezik
            if (!results.length) {
                // felhasznalo beszurasa a users tablaba
                db.query('INSERT INTO users SET ?', userCrate, function (error, results, fields) {
                    if (error) {
                        return console.error(error.message);
                    }
                    //res.redirect("/login", {success : 'A registracio sikerult'});
                    res.render("login", {
                        title : 'Bejelentkezés',
                        msg : 'Sikeres regisztráció! Jelentkezz be'});
                   // console.log('Row inserted:' + results.affectedRows);
                });
            } else {
                //db.end();
                return res.render('registration', {
                    title : 'Regisztráció',
                    msgReg : 'Az email cím foglalt!'});
                //return res.send("A felhasználó!")
            }


        });
        // return a;
    }

/*




//    db.query('SELECT username, password FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
    //if(email && password && nameirl && phone && city && street && adnumber && floorbell){
      //  let regQuery = `INSERT INTO users(username, password, phone, email, address) SET ?`;
        let regQuery = `INSERT INTO users SET ?`;
      //  let regValues = [ username, password, email, address, phone, points];
      //  db.query(regQuery, regValues, function(error, results, fields){
        db.query(regQuery, userCrate, function(error, results, fields){

            if (error) {
                return console.error(error.message);
            }
            res.redirect("/login");
            console.log('Row inserted:' + results.affectedRows);
        })
    //}

*/
});

module.exports = router;