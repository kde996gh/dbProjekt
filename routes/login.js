const express = require('express');
const router = express.Router();
const db = require('../authenticate/dbconnect');
const util = require('util');

router.get('/', function(req, res, next) {
    if(req.session.isLoggedIn){
        res.render(  'login',{title: 'Bejelentkezés',
            message : 'Hello!'})
    }else{
        res.render(  'login',{title: 'Bejelentkezés',
            message : ''})
    }


});

router.post('/', async function(req, res, next){
    const email = req.body.email;
    const password = req.body.password;
    const query = util.promisify(db.query).bind(db);
    //email és jelszó ellenőrzése adatbázisból, bejelentkezéskor
    let loginQ = await query('SELECT email, password FROM users WHERE email = ? AND password = ?', [email, password]);
            if(loginQ.length > 0) {
                req.session.isLoggedIn = true;
                req.session.user = email;
                req.session.isAdmin = (email === "admin@pizzadenk.com")
                if(req.session.isAdmin)
                    res.redirect("/personal");
                else
                    res.redirect("/");
            }
            else{
                res.render('login', {
                msg: 'Hibás jelszó vagy email cim',
                title : 'Bejelentkezés'
                });
            }
});









module.exports = router;