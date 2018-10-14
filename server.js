//npm required packages

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var hbs = require('express-handlebars');
var cheerio = require('cheerio');
var axios = require ('axios');

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


//mongoDB

//Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);



//routes


app.get("/", function(req, res) {
    res.render("index")
})

app.get("/saved", function(req, res) {
    res.render("index", { articles: data })
})



//Get route for scraping artciles from NYTimes website.
app.get('/scrape', function(req, res) {

    //Making a request for articles from the New York Times

    axios.get('https://www.nytimes.com/').then(function(response) {

        //html body request gets loaded into cheerio.//
        var $ = cheerio.load(response.data);
        
             ///result object
             var result = {};

        //Each artilce has a headline class
        $('div.story-body').each(function(i, element) {

           
            var link = $(element).find("a").attr("href");
            var headline = $(element).find("h2.headline").text().trim();
            var summary = $(element).find("p.summary").text().trim();

            result.link = link;
            result.headline = headline;
            result.summary = summary;

            //if function to validate element has all 3 requirements

            if(headline && summary && link) {

                //insert scraped data into Mongo DB
                db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);

                    //counter
                    counter++;
                })
                //catch error and send back to frontend
                .catch(function(err) {
                    return res.json(err);
                });
            };
                
        });   

        //if scrape completes with data send updated inxex.html file
        res.render("index", { articles: result })
    });
});

//Route to retrieve all data from the DB
app.get('/articles', function (req, res) {
    //query to find all scraped data in DB
    db.Article.find({})

        //found articles are sent back to the browser
        .then(function(dbArticle) {
            res.json(dbArticle);
        })

        //if error, catch error.
        .catch(function(err) {
            res.json(err);
        });
});


///Route to grab article by id - this will be for leaving notes//

app.get('/articles/:id', function(req, res) {
    //query to finnd the article in the DB by searching on the ID
    db.article.findOne({ _id: req.paramus.id })

    //After query for article, populate associated notes
    .populate('note')
    .then(function(dbArticle) {
        //if article found, send back to the frontend
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err)
    });
})



//Route to save articles and updating notes on articles.
app.post('/articles/:id', function(req, res) {
    //creating a new note.  Req.body is from the client side.
    db.Note.create(req.body)
        .then(function(dbNote) {
            
            //after note is created, note is added to article based on article ID
                return db.Article.findOneAndUpdate(
                        { _id: req.params.id },
                        { note: dbNote._id },
                        { new: true}
                    
                    //After the note is posted, the updated article is returned to the frontend.
                    ).then(function(dbArticle) {
                        res.json(dbArticle);
                    }).catch(function(err) {
                        res.json(err);
                    });
        });
});





//Server Start
app.listen(PORT, function() {
    console.log("App running on port  " + PORT);
});