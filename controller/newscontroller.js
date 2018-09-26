//dependencies
var express = require('express');
var path = require('path');

//Express router
var router = express.router();

//Request and Cheerio to scrape.
var axios = require('axios');

//require models
var comment = require('../models/note.js');
var article = require('../models/article.js');


//Get route for scraping artciles from NYTimes website.
app.get('/scrape', function(req, res) {

    //Making a request for articles from the New York Times

    request('https://www.nytimes.com/ ', function(error, response, html) {

        //html body request gets loaded into cheerio.//
        var $ = cheerio.load(html);
        
        //Each artilce has a headline class
        $('css-6p61n1').each(function(i, element) {

            ///result object
            var result = {};

            result.headline = $(this).children('balancedHeadline').text();
            result.summary = $(this).children('css-balf30 e1n8kpyg0').text();
            result.link = $(this).children("a").attr("href");

            //if function to validate element has all 3 requirements

            if(headline && summary && link) {

                //insert scraped data into Mongo DB
                db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    return res.json(err);
                });
            };
                
        });   

        res.send('Articles Have Been Scraped');
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