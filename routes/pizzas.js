var express = require('express');
var router = express.Router();
const db = require('../authenticate/dbconnect');
const util = require('util');

router.get('/', async function(req, res, next) {
    const query = util.promisify(db.query).bind(db);
    const pizzakSorok = await query('SELECT * FROM pizza');
        let pizzak = [];
       // pizza objektum letrehozasa es adattagok eltarolasa a lekerdezesbol
       for(let i = 0; i<pizzakSorok.length; i++) {
           let pizza = {
               pizzaId: pizzakSorok[i].idpizza,
               name: pizzakSorok[i].pizzaName,
               priceM: pizzakSorok[i].midPrice,
               priceL: pizzakSorok[i].largePrice
           };
           //alapanyagok lekérése az adott IDjű pizzahoz
           let getMaterials = await query(`
           SELECT pizzeriadb.needs.materialName 
           FROM pizzeriadb.pizza, pizzeriadb.needs 
           WHERE pizzeriadb.pizza.idpizza = pizzeriadb.needs.pizzaId 
           AND pizzeriadb.needs.pizzaId = ${pizzakSorok[i].idpizza}
           ORDER BY pizzeriadb.needs.materialName DESC;`);
            // adott alapanyag lekerdezes tömbből stringgé alakítása és a pizza objektumhoz való csatolása
           let stringge = "";
           for (let a = 0; a < getMaterials.length; a++) {
               if(stringge.length === 0)
                   stringge += getMaterials[a].materialName;
               else
                   stringge += ", " + getMaterials[a].materialName;
           }
           pizza.material = stringge;
           pizzak.push(pizza);
       }

        res.render('pizzas', {
        title: 'Pizzák',
        pizzas : pizzak

    });
});


module.exports = router;
