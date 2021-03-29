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
           let midPrice = parseInt(pizzakSorok[i].midPrice);
           let largePrice = parseInt(pizzakSorok[i].largePrice);
           let currPizzaId = pizzakSorok[i].idpizza;
           let pizza = {
               pizzaId: pizzakSorok[i].idpizza,
               name: pizzakSorok[i].pizzaName
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
           /// pizzak listazasa mennyiseggel
           let matPrice = await query(`
                    SELECT SUM(pizzeriadb.material.price) AS ar
                    FROM pizzeriadb.pizza, pizzeriadb.material, pizzeriadb.needs
                    WHERE pizzeriadb.pizza.idpizza = pizzeriadb.needs.pizzaId
                    AND pizzeriadb.needs.materialName = pizzeriadb.material.matName
                    AND pizzeriadb.needs.pizzaId = ${currPizzaId};
                `);
           midPrice += parseInt(matPrice[0].ar);
           largePrice += parseInt(matPrice[0].ar);

           pizza.priceM = midPrice;
           pizza.priceL = largePrice;
           pizza.material = stringge;
           pizzak.push(pizza);
       }
            //legjobb ár - érték ajánlat kiszámolása, ami az átlag alatt van azt adja vissza
            //alkérdéses lekérdezés
           let bestValue = await query(`
                                    SELECT pizzeriadb.pizza.pizzaName
                                    FROM pizza
                                    WHERE (largePrice+150) < (SELECT avg(pizzeriadb.pizza.largePrice) FROM pizzeriadb.pizza);`);

        res.render('pizzas', {
        title: 'Pizzák',
        pizzas : pizzak,
            bestValue : bestValue

    });
});
module.exports = router;
