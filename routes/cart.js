var express = require('express');
var router = express.Router();
const db = require('../authenticate/dbconnect');
const util = require('util');


router.get('/', function(req, res, next) {



        if(req.session.cartContent !== undefined){
            for(let i =0; i<req.session.cartContent.length; i++){
                console.log(req.session.cartContent[i]['id']);

                    // TODO: query ami összeadja a materiaal arakat + pizza arat és hozzá adja az adott objecthez


                    // TODO: vegosszeg




                req.session.cartContent[i]['price'] = 55+i*10;
            }
        }






    res.render('cart', {
        title: 'Kosár',
        zsa : req.session.cartContent,
        sumPrice : 5
    });
});

module.exports = router;
