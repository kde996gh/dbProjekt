var express = require('express');
var router = express.Router();
const db = require('../authenticate/dbconnect');
const util = require('util');


router.get('/', async function(req, res, next) {
    console.log(req.session.loggedInUser)
    //lekérdezés promissá alakitása
    const query = util.promisify(db.query).bind(db);
        //uj valtozba mentes mivel amugy mindig hozzáadná az adott összeghez saját magát minden ujtratöltésnél
        //ár kiszámolása
        let curr = req.session.cartContent;
        let priceSum = 0;
        if(curr !== undefined) {
            for (let i = 0; i < curr.length; i++) {
                priceSum += parseInt(curr[i].meret);
            }
        }
        //oldal betöltése az átadott adatokkal
    res.render('cart', {
        title: 'Kosár',
        zsa : req.session.cartContent,
        addressData : req.session.loggedInUser,
        priceSum : priceSum
    });
});

module.exports = router;
