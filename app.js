var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')

const db = require('./authenticate/dbconnect');

const util = require('util');
const query = util.promisify(db.query).bind(db);

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let loginRouter = require('./routes/login');
let pizzasRouter = require('./routes/pizzas');
let contactRouter = require('./routes/contact');
let cartRouter = require('./routes/cart');
let personalRouter = require('./routes/personal');
let testRouter = require('./routes/test')




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
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


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
app.use('/pizzas', pizzasRouter);
app.use('/contact', contactRouter);
app.use('/cart', cartRouter);
app.use('/personal', personalRouter);
app.use('/test', testRouter);




app.get('/logout', function(req,res,next){
  req.session.destroy();
  res.redirect("/")
})

app.post('/addtocart',  function(req,res,next){
    let rendeles = {
        id : req.body.pizza_id,
        name : req.body.pizzaName,
        extra : req.body.pizzaMaterial,
        meret : req.body.size
    }
    if(req.session.cartContent) {
        req.session.cartContent.push(rendeles);
        req.session.cartContentCount++;
    }else {
      req.session.cartContent = [];
      req.session.cartContent.push(rendeles);
      req.session.cartContentCount = 1;

    }
  res.redirect("/pizzas")
})

app.post("/addToOrderTable",  async function(req, res, next){

    //random id generator,
    let orderIdGen = Math.floor((Math.random() * 10000) + 1);
    // console.log(orderIdGen);
    let d = new Date();
    // console.log("final price: ", d);
    //const query = util.promisify(db.query).bind(db);

    let orderFinal = {
        Order_id : orderIdGen,
        Status : 'Feldolgozas alatt',
        finalPrice : parseInt(req.body.finalPrice),
        phone : req.body.phone,
        city : req.body.city,
        street : req.body.street,
        adNumber : req.body.adNumber,
        floorBell : req.body.floorBell,
        name : req.body.nameirl,
        when : d,
        email : req.body.email
    };
    let email = req.body.email;
    let emailCheck =await query(`SELECT * FROM pizzeriadb.users WHERE email = "${email}"`);
    if(emailCheck.length === 0){
        let userInsertToUsers = {
            email : req.body.email,
            password : "password",
            nameirl : req.body.nameirl,
            phone : req.body.phone,
            city : req.body.city,
            street : req.body.street,
            adNumber : req.body.adNumber,
            floorBell : req.body.floorBell,
            isAdmin : 0
        };
       await query('INSERT INTO users SET ?', userInsertToUsers);
    }


    await query('INSERT INTO pizzeriadb.order SET ?', orderFinal);

    //egyforma tipusu pizzák mennyiségének kiszámolása, ez sette alakitasa
    let idArray = []
    for(let i =0; i<req.session.cartContentCount; i++) {
        idArray.push(req.session.cartContent[i].id);
    }
    let count = {};
    idArray.forEach(function(i) { count[i] = (count[i]||0) + 1;});

    for (let [key, value] of Object.entries(count)) {
        db.query(`INSERT INTO pizzeriadb.includes (orderId, mennyiseg, pizzaId) VALUES ( ${orderIdGen}, ${value}, ${key})`);
        //console.log(`${key}: ${value}`);
    }
    delete req.session.cartContent;
    delete req.session.cartContentCount;
    res.render('index', {
        title: 'Főoldal',
        success : "Sikeres rendelés!"
    });

})


//TODO : rendeles leadasa, a rendelesek tablaba való beszúrás // Insert into tablee
app.post('/editstatus',  async function(req,res,next) {



    const rendelesek = await query('SELECT * FROM pizzeriadb.order');
    //
    if(req.body.status==='Torles'){
        let currId = req.body.orderId;
        await query(`DELETE FROM pizzeriadb.includes WHERE pizzeriadb.includes.orderId = ${currId};`);
        await query(`DELETE FROM pizzeriadb.order WHERE pizzeriadb.order.Order_id = ${currId};`);
    }else {
        await query(`UPDATE pizzeriadb.order SET Status = '${req.body.status}' WHERE Order_id = ${req.body.orderId}`);
    }
    res.render('index', {
        title: 'Admin',
        rendelesek : rendelesek
    });
});

app.post('/pwchange',  async function(req,res,next) {
    let email = req.body.email;
    let oldPassword = req.body.passwordOld
    let newPw1 = req.body.password1;
    let newPw2 = req.body.password2;
    console.log(email)
    console.log(oldPassword)
    console.log(newPw1)
    console.log(newPw2)
    let oldPwCheck = await query(`SELECT password FROM users WHERE email = '${email}'`);
    if(oldPwCheck[0].password === oldPassword && newPw1===newPw2){
        await query(`UPDATE pizzeriadb.users SET password = '${newPw1}' WHERE email = '${email}'`);
        res.render('personal', {
            title: 'Admin',
            msg : "Sikeres jelszócsere!"
        });
    }
    else{
        res.render('personal', {
            title: 'Admin',
            msg : "Hibás a megadott régi és/vagy az új jelszavak nem egyeznek!"
        });
    }

});




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
