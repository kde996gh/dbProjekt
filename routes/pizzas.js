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
                priceM : pizzakSorok[i].midPrice,
                priceL : pizzakSorok[i].largePrice,
                alapok : pizzakSorok[i].ingridents
            };
            pizzak.push(pizza);
        }

        const pizzakWithToppings = await pizzak.reduce(async (acc,pizza) =>{
            const needsRows = await query(`SELECT * FROM needs WHERE needs.pizzaId = ${pizza.pizzaId}`) || [];
                const needs = needsRows.map(requires => requires.materialName );
                const tempPizza = {...pizza, toppings : needs};
                return [...(await acc) , tempPizza];
        },[])

        res.render('pizzas', {
        title: 'Pizzák',
        pizzas : pizzakWithToppings
    });
});


module.exports = router;
