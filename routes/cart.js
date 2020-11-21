var express = require('express');
var router = express.Router();
const db = require('../authenticate/dbconnect');
const util = require('util');


router.get('/', async function(req, res, next) {
    const query = util.promisify(db.query).bind(db);

    let totalSUmma = 0;

        if(req.session.cartContent !== undefined) {
            for (let i = 0; i < req.session.cartContent.length; i++) {
                currPizzaId = req.session.cartContent[i]['id'];
                currFeltetek = req.session.cartContent[i]['extra'];
                //console.log(currPizzaId);
               // console.log("feltetek: ", currFeltetek)
                let sum = 0;
                //+ feltétek árának kiszámolása
                if (currFeltetek !== undefined) {
                    //array check kell mivel ha csak +1 extra feltet van akkor azt nem tömbnek veszi hanem sima véltozónak és elszáll a program
                    if(Array.isArray(currFeltetek)){
                        for(let k = 0; k<currFeltetek.length; k++){
                           // console.log("feltetekCiklus: ", currFeltetek[k])
                            const sorok = await query('SELECT ar FROM material WHERE name IN  (?)', currFeltetek[k]);
                            //console.log("sorok: ", (sorok[0].ar));
                          // console.log("sorok: ", sorok[0].ar)
                              sum += sorok[0].ar;
                        }
                    }
                    else{
                        const sor = await query('SELECT ar FROM material WHERE name IN  (?)', currFeltetek);
                        sum += sor[0].ar;
                       // console.log(sor[0].ar)
                    }

                }
                //adott puzza ára
                let qqq = parseInt(req.session.cartContent[i]['meret']);
                //console.log('SIZE : ', req.session.cartContent[i]['meret']);

                req.session.cartContent[i]['total'] = sum + qqq;
               // console.log("SUMMA", sum);
                totalSUmma += (qqq+sum);
            }

        }

                   /*
                   let sql = 'SELECT ar FROM material WHERE name = ?';
                   for(let j=0; j<currFeltetek.length; j++){
                       db.query(sql, currFeltetek[j], function(err, result){
                          // sum += result;
                            console.log("result: ", result);
                            for(let k in result){
                                sum+=k;
                            }
                       })
                   }
               }

*/














    res.render('cart', {
        title: 'Kosár',
        zsa : req.session.cartContent,
        sumPrice : totalSUmma
    });
});

module.exports = router;
