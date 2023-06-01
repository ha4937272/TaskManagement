require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const ejs = require('ejs')
const path = require('path')
const PORT = process.env.PORT || 3300
const mongoose = require('mongoose')
//const session = require('express-session')
//const flash = require('express-flash')
//const MongoDbStore = require('connect-mongo')(session)
//const passport = require('passport')
//const staffpassport = require('passport')


// Database connection
/*
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/taskmanagement',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
*/
mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}




// Session store
/*
let mongoStore = new MongoDbStore({
                mongooseConnection: db,
                collection: 'sessions'
            })
*/


// Session config
/*
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))
*/
// Passport config
/*
const staffPassportInit = require('./app/config/staffpassport');
// Use passport middleware
staffPassportInit(staffpassport);
app.use(staffpassport.initialize());
app.use(staffpassport.session());
*/
//app.use(flash())
// Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Global middleware
/*
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    res.locals.staff = req.staff
    next()
})
*/
// set Template engine
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

connectDB().then(() => {
const server = app.listen(PORT , () => {
            console.log(`Listening on port ${PORT}`)
        })
      })

