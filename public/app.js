//Pull artiles.  Articles will load as a json

$.getJSON("/articles", function(data) {
    //loop through for each article
    for(var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>
    })
    }
}
)