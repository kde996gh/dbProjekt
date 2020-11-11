var express = require('express');
var router = express.Router();
const db = require('../authenticate/dbconnect');
/* GET home page. */
const util = require('util');

router.get('/', async function(req, res, next) {

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

        res.render('pizzas', {
        title: 'Pizzák',
        pizzas : pizzak
    });
});


module.exports = router;
