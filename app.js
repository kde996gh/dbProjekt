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
let loginRouter = require('./routes/login');
let pizzasRouter = require('./routes/pizzas');
let contactRouter = require('./routes/contact');
let cartRouter = require('./routes/cart');
let personalRouter = require('./routes/personal');


let registrationRouter = require('./routes/registration')

const app = express();
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

function sess(req,res,next){
  res.locals.session = req.session;
  next();
}
app.use(sess);

app.use('/', indexRouter);
app.use('/login', loginRouter)
app.use('/registration', registrationRouter);
app.use('/pizzas', pizzasRouter);
app.use('/contact', contactRouter);
app.use('/cart', cartRouter);
app.use('/personal', personalRouter);

app.get('/logout', function(req,res,next){
  req.session.destroy();
  res.redirect("/")
})

app.post('/addtocart',  function(req,res,next){
    //rendelés létrehozása a pizzak oldalról
    let rendeles = {
        id : req.body.pizza_id,
        name : req.body.pizzaName,
        extra : req.body.pizzaMaterial,
        meret : req.body.size
    }
    //ha létezik már a sesssion tartalom változó akkor belepusholja
    if(req.session.cartContent) {
        req.session.cartContent.push(rendeles);
        req.session.cartContentCount++;
    }
    // ha nem akkor létrehozza és belerakja
    else {
      req.session.cartContent = [];
      req.session.cartContent.push(rendeles);
      req.session.cartContentCount = 1;

    }
  res.redirect("/pizzas")
})

app.post("/addToOrderTable",  async function(req, res, next){
    //rendelés generálása
    let orderIdGen = Math.floor((Math.random() * 10000) + 1);
    let d = new Date();
    //rendelés létrehozása
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
    //felhasználó ellenőrzése hogy létezik a megadott email
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
        //ha nem akkor létrehozza a felhasználót
       await query('INSERT INTO users SET ?', userInsertToUsers);
    }
    // majd beteszi a rendelésbe a rendekés objektumot
    await query('INSERT INTO pizzeriadb.order SET ?', orderFinal);
    //idk kigyűjtése
    let idArray = []
    for(let i =0; i<req.session.cartContentCount; i++) {
        idArray.push(req.session.cartContent[i].id);
    }
    // kulcs érték páros létrehozása, ez azért kell hogy megszámolja hogy az adott rendelésben az adott pizzából hány darab van
    let count = {};
    idArray.forEach(function(i) { count[i] = (count[i]||0) + 1;});
    // majd ezt beszúrja az includes táblába, ami tartalmazza ezeket
    for (let [key, value] of Object.entries(count)) {
        db.query(`INSERT INTO pizzeriadb.includes (orderId, mennyiseg, pizzaId) VALUES ( ${orderIdGen}, ${value}, ${key})`);
        //console.log(`${key}: ${value}`);
    }
    // törli a session változót
    delete req.session.cartContent;
    delete req.session.cartContentCount;
    res.render('index', {
        title: 'Főoldal',
        success : "Sikeres rendelés!"
    });
})
app.post('/editstatus',  async function(req,res,next) {
    // a rendelés állapotának megváltoztatása
    const rendelesek = await query('SELECT * FROM pizzeriadb.order');
    // ha törlés van kiválasztva akkor törli az adatbázisból a rendelést
    if(req.body.status==='Torles'){
        let currId = req.body.orderId;
        await query(`DELETE FROM pizzeriadb.includes WHERE pizzeriadb.includes.orderId = ${currId};`);
        await query(`DELETE FROM pizzeriadb.order WHERE pizzeriadb.order.Order_id = ${currId};`);
    }else {
        //ha más akkor módisítja az állapotát
        await query(`UPDATE pizzeriadb.order SET Status = '${req.body.status}' WHERE Order_id = ${req.body.orderId}`);
    }
    res.redirect("personal");
});
app.post('/editprice',  async function(req,res,next) {
    // admin tud árat változtatni
    let currId = parseInt(req.body.pizzaIdChange);
    let mprice = parseInt(req.body.midPriceChange);
    let lprice = parseInt(req.body.largePriceChange);
    // ár update
    await query(`
    UPDATE pizzeriadb.pizza 
    SET midPrice = '${mprice}', largePrice = '${lprice}'
    WHERE idpizza = ${currId}`
    );
    res.redirect("personal");

});



app.post('/pwchange',  async function(req,res,next) {
    //user tud jelszót cserélni
    let email = req.body.email;
    let oldPassword = req.body.passwordOld
    let newPw1 = req.body.password1;
    let newPw2 = req.body.password2;
    // ellenőrzi, hogy a beirt régi jelszó megfelelő-e
    let oldPwCheck = await query(`SELECT password FROM users WHERE email = '${email}'`);
    //ellenőrzi, hogy a beirt 2 uj jelszó meggfelelőe
    if(oldPwCheck[0].password === oldPassword && newPw1===newPw2){
        //ha igen, akkor updateli a dbben a jelszót a megfelelő usernél
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
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
