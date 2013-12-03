/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageSchema = new Schema({
    created_on: {
        type: Date,
        default: Date.now
    },
    body: {
        type: String,
        default: '',
        trim: true
    },
    to: {
        type: String,
        default: '',
        trim: true
    },
    from: {
        type: String,
        default: '',
        trim: true
    }
});

/**
 * Validations
 */
// ArticleSchema.path('title').validate(function(title) {
//     return title.length;
// }, 'Title cannot be blank');

/**
 * Statics
 */
MessageSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('body', 'body').exec(cb);
    }
};

mongoose.model('Message', MessageSchema);