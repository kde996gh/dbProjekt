var express = require('express');
var router = express.Router();

/*
router.get('/', function(req, res, next) {
  if(req.session.viewCount){
    req.session.viewCount++;
  }else{
    req.session.isLoggedIn = true;
    req.session.user = "Tibike";
    req.session.viewCount = 1;
  }
  res.send(`<h1>You have visited ${req.session.viewCount} times, ${req.session.user} </h1>`)
  res.send(session.isLoggedIn);
 //res.render("index", {authorized: authorized})

// res.send('respond with a resource');
});
*/
module.exports = router;
