var express = require('express');
var router = express.Router();
const db = require('../authenticate/dbconnect');
const util = require('util');

/* GET home page. */
router.get('/', async function(req, res, next) {

    if(req.session.isAdmin == true){

        const query = util.promisify(db.query).bind(db);

        const pizzakSorok = await query('SELECT * FROM pizza');
        let pizzak = [];
        for(let i = 0; i<pizzakSorok.length; i++){
            let pizza = {
                pizzaId :  pizzakSorok[i].idpizza,
                name : pizzakSorok[i].pizzaName,
                meretL : pizzakSorok[i].midPrice,
                meretXXL : pizzakSorok[i].largePrice
            };
            pizzak.push(pizza);
        }








        res.render('personal', {
            title: 'Admin',
            pizzas : pizzak
        });
    }
    else{
        res.render('personal', {
            title: 'Adatlap',
        });


    }




});

module.exports = router;
