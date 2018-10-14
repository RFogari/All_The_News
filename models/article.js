var mongoose = require('mongoose');

//Schema constructor
var Schema = mongoose.Schema;

//Schema constructor for creating a new UserSchema object
var newsArticleSchema = new Schema({

    //headline required
    headline: {
        type: String,
        required: true,
    },
    //article summary required
    summary: {
        type: String,
        required: true,
    },
    //link to article required
    link: {
        type: String,
        required: true
    },

    //keyID being used to represent the object ID.
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"

    },

    created: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        default: "Save Article"
    },

    isSaved: {
        type: Boolean,
        default: false
    }
});

//Schema is processed through Mongoose to create a model

var article = mongoose.model('article', newsArticleSchema);

//export the model
module.exports = article;