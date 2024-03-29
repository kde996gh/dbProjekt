var express = require('express');
var router = express.Router();
const db = require('../authenticate/dbconnect');
const util = require('util');

router.get('/', async function(req, res, next) {
    const query = util.promisify(db.query).bind(db);
    if(req.session.isLoggedIn){
        let email = req.session.user;
        //a bejelentkezett user adatainak lekérése adatábzisból és sessionben való eltárolása
        const currUser = await query(`SELECT * FROM pizzeriadb.users WHERE email = ?`, email);
            req.session.loggedInUser = {
                email : currUser[0].email,
                nameirl : currUser[0].nameirl,
                phone : currUser[0].phone,
                city : currUser[0].city,
                street : currUser[0].street,
                adNumber : currUser[0].adNumber,
                floorBell : currUser[0].floorBell

            };
    }
    console.log(req.session.loggedInUser);

    res.render('index', {
        title: 'Pizzeria',
    });
});

module.exports = router;
