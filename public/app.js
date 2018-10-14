$(document).ready(function(){

    
//display articles on screen 
function displayArticles() {
    $.getJSON("/articles", function(data) {
        //loop through each article
        for (var i = 0; i < data.length; i++) {

            //build each artcile
            var newArticle = $("<div>");
            newArticle.attr("class", "article");
            newArticle.data("id", artilcle._id);
            

            var artHeadline = $("<h4>")
            artHeadline.attr("class", "articleHeadline")
            artHeadline.text(article.headline)

            var artSummary = $("<p>");
            artSummary.attr("class", "articleSummary");
            artSummary.text(article.summary);

            var notesButton = $("</a>")
            notesButton.attr("href", '/')

            
            //add new articles
            newArticle.append(artHeadline);
            newArticle.append(artSummary)
            $(".articles-cotainer").prepend(newArticle);

        }
    })

}

//when page loads display articles
displayArticles();


$(document).on("click", ".scrapeButton", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
        .then(function(data) {
            console.log(data);

            displayArticles();
        })
})

})