var express = require('express');
var router = express.Router();
const db = require('../authenticate/dbconnect');
const util = require('util');

/* GET home page. */
router.get('/', async function(req, res, next) {

    if(req.session.isAdmin == true){


        const query = util.promisify(db.query).bind(db);

       const rendelesek = await query('SELECT * FROM pizzeriadb.order');
       // console.log(rendelesek);









        res.render('personal', {
            title: 'Admin',
            rendelesek : rendelesek
        });
    }
    else{
        res.render('personal', {
            title: 'Adatlap',
        });


    }




});

module.exports = router;
