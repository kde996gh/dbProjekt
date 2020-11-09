const express = require('express');
const router = express.Router();

router.get('/', function(req,res,next){
    res.render(  'registration',{title: 'Regisztráció' });

});

router.post('/', function(reg,res,next){

});

module.exports = router;