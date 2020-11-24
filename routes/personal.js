var express = require('express');
var router = express.Router();
const db = require('../authenticate/dbconnect');
const util = require('util');

/* GET home page. */
router.get('/', async function(req, res, next) {

    if(req.session.isAdmin === true){

        const query = util.promisify(db.query).bind(db);

       const rendelesek = await query('SELECT * FROM pizzeriadb.order');

      // const osszetettRendeles = await query("");
        let a  = rendelesek;
        for(let x=0; x<a.length; x++){
            //a[x].tipusok = "minden joooo";
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
           for(let y=0; y<typeCount.length; y++){
               //if(tipusok.length===0)
                  tipusok.push(`${typeCount[y].pizzaName} ${typeCount[y].mennyiseg}`);
              /// else
                  // tipusok += (`\n${typeCount[y].pizzaName} ${typeCount[y].mennyiseg}`)
              // console.log(typeCount[y].pizzaName, typeCount[y].mennyiseg);
           }
            a[x].tipusok = tipusok;
            console.log(tipusok);
            console.log("-----------------------------------------------------------")



        }
      //  console.log(a);

       // console.log(rendelesek);
        /*


         */

        res.render('personal', {
            title: 'Admin',
            rendelesek : a
        });
    }
    else{
        res.render('personal', {
            title: 'Adatlap',
        });


    }




});

module.exports = router;
