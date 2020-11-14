var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    let arr = req.body.feltetek;
    console.log(arr)

    const cont = req.session.cartContent;

    res.render('cart', {
        title: 'Kosár',
        cont : cont
    });
});

module.exports = router;
