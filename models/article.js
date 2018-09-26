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
    keyID: {
        type: Schema.Types.ObjectId,
        ref: "keyID"

    }
});

//Schema is processed through Mongoose to create a model

var Article = mongoose.model('Article', newsArticleSchema);

//export the model
module.exports(Article);