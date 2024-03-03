require("dotenv").config();

const express = require("express");
const methodOverride = require("method-override");
const expressLayout = require("express-ejs-layouts");
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');

const connectDB = require("./server/config/db.js");




const app = express();
const PORT = 5000 || process.env.PORT;


app.use(express.static('public'));

// Connect to DB
connectDB();


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use(methodOverride('_method'));


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB
    })
}));


// Express Templates Layouts
app.use(expressLayout);
app.set("layout", "./layouts/main.ejs");
app.set("view engine", "ejs")


app.use('/', require("./server/routes/main"));
app.use('/', require("./server/routes/admin"))



app.listen(PORT, () => {
    console.log("listening...");
});