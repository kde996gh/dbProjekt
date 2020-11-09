var express = require('express');
var router = express.Router();
var userCheck = require('../authenticate/userCheck');


router.get('/', function(req, res, next) {
    res.render(  'login',{title: 'Login' });
});


router.post('/', function(req, res, next){
    const username = req.body.username;
    const password = req.body.password;
    let loginResult = userCheck(username, password);

    if(loginResult){
        req.session.isLoggedIn = true;
        req.session.user = username;
        res.redirect("/")
    }
    else{
        res.send("<h1> Hibas jelszo vagy felhasználónév! </h1>")
    }


})



module.exports = router;