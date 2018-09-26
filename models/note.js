var mongoose = require('mongoose');

//Schema constructor
var Schema = mongoose.Schema;

//create a Note Schema
var noteSchema = new Schema({
    //title of comment
    title: String,
    //text of comment
    body: String,
});

// create the note model using the note schema
var note = mongoose.model('note', noteSchema);

//export note module
module.exports = note;