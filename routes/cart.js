var express = require('express');
var router = express.Router();
const db = require('../authenticate/dbconnect');
const util = require('util');


router.get('/', async function(req, res, next) {
    console.log(req.session.loggedInUser)
    const query = util.promisify(db.query).bind(db);
        //uj valtozba mentes mivel amugy mindig hozzáadná az adott összeghez saját magát minden ujtratöltésnél
        let curr = req.session.cartContent;
       // console.log(curr);
        let priceSum = 0;
        if(curr !== undefined) {
            for (let i = 0; i < curr.length; i++) {
                let totalSum = 0;

                let currPizzaId = curr[i]['id'];
                //a pizzák ára a rajta lévő feltétektől függ, ezt minden pizzára külön számolja ki, az alábbi lekérdezés
                let sum = await query(`
                    SELECT SUM(pizzeriadb.material.price) AS ar
                    FROM pizzeriadb.pizza, pizzeriadb.material, pizzeriadb.needs
                    WHERE pizzeriadb.pizza.idpizza = pizzeriadb.needs.pizzaId
                    AND pizzeriadb.needs.materialName = pizzeriadb.material.matName
                    AND pizzeriadb.needs.pizzaId = ${currPizzaId};
                `);
                totalSum += parseInt(sum[0].ar) + parseInt(curr[i].meret);
             //   console.log(typeof parseInt(sum[0].ar));
                //console.log("TOTAL: ", totalSum)
                curr[i].ar = totalSum ;
                priceSum += totalSum;
            }
        }





    res.render('cart', {
        title: 'Kosár',
        zsa : curr,
        addressData : req.session.loggedInUser,
        priceSum : priceSum
    });
});

module.exports = router;
