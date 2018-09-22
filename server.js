//npm required packages

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var hbs = require('express-handlebars');
var cheerio = require('cheerio');

//require models
var db = require('./models');

//port setting
var PORT = process.env.PORT || 3000;

//initialize Express
var app = express();

//Use body-parser to hadle form submission
app.use(bodyParser.urlencoded({ extended: true }));

//public folder as stactic directory for front-end HTML/CSS.
app.use(express.static('public'));


//Handlebars setup
app.engine('handlebars', hbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



//Connect to the Mongo DB
mongoose.connect("")