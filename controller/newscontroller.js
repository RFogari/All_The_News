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
app.get('/scrape', fucntion(req, res) {

    //Making a request for articles from the New York Times.

    request("https://www.nytimes.com/", function(error, response, html) {

        //html body request gets loaded into cheerio.
        var $ = cheerio.load(html);
        
        //Each artilce has a headline class
        $('css-6p61n1').each(function(i, element) {
            var headline = $(element).children('balancedHeadline').text();
            var summary = $(element).children('css-balf30 e1n8kpyg0').text();
            var link = $(element).children("a").attr("href");

            //if function to validate element has all 3 requirements

            if(headline && summary && link) {

                //insert scraped data into Mongo DB
                db.newsData.insert({
                    headline: headline,
                    summary: summary,
                    link: link,
                },

                    function(err, inserted) {
                        
                        //log error if issue arises while adding record to DB.
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(inserted);
                        };
                    }
            
                )
            }    
        });        



    });

});