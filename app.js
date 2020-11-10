var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let loginRouter = require('./routes/login');
let registrationRouter = require('./routes/registration')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret : "some secret",
  resave : false,
  saveUninitialized: true,
  cookie:{
    maxAge: 1000*60*60*24
  }
}));
/*
app.get('/',(req, res, next)=>{
  if(req.session.viewCount){
    req.session.viewCount++;
  }else{

    req.session.viewCount = 1;
  }
  req.session.user = "Tibike"
  res.send(`<h1>You have visited ${req.session.viewCount} times, ${req.session.user} </h1>`)
})
*/

function sess(req,res,next){
  res.locals.session = req.session;
  next();
}

app.use(sess);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter)
app.use('/registration', registrationRouter);


app.get('/logout', function(req,res,next){
  req.session.destroy();
  //res.send(`<h1>You have visited ${req.session.viewCount} times, ${req.session.user} </h1>`)
  res.redirect("/")
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
