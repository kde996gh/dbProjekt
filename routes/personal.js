var express = require('express');
var router = express.Router();
const db = require('../authenticate/dbconnect');
const util = require('util');

router.get('/', async function(req, res, next) {
    if(req.session.isAdmin === true){
        const query = util.promisify(db.query).bind(db);
       const rendelesek = await query('SELECT * FROM pizzeriadb.order');
        let a  = rendelesek;
        for(let x=0; x<a.length; x++){
            //rendeleshez tartozo pizzak és mennyiseg befuzese az elozo lekerdezes objektumba
           const typeCount = await query (`
                SELECT  pizzeriadb.pizza.pizzaName, pizzeriadb.includes.mennyiseg
                FROM pizzeriadb.order, pizzeriadb.includes, pizzeriadb.pizza
                WHERE pizzeriadb.order.Order_id = pizzeriadb.includes.orderId
                AND pizzeriadb.includes.pizzaId = pizzeriadb.pizza.idpizza
                AND pizzeriadb.order.Order_id = ${a[x].Order_id}
                GROUP BY pizzeriadb.pizza.pizzaName
                ORDER BY pizzeriadb.order.Order_id`);
           // tömbként tárolom, utána lehet iterálni vele listázáskor
           let tipusok =[];
           //rendelésben található pizzák és mennyiségének kiszámolása
           for(let y=0; y<typeCount.length; y++){
                  tipusok.push(`${typeCount[y].pizzaName} ${typeCount[y].mennyiseg}`);
           }
           //objektum attributumához ad
            a[x].tipusok = tipusok;
        }
        //minden pizzalekérése dbből
        const pizzakSorok = await query('SELECT * FROM pizza');

        res.render('personal', {
            title: 'Admin',
            rendelesek : a,
            pizzak : pizzakSorok
        });
    }
    else{
        res.render('personal', {
            title: 'Adatlap',
        });
    }
});

module.exports = router;
