/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Message Schema
 */
var UserSchema = new Schema({
    created_on: {
        type: Date,
        default: Date.now
    },
    phone_number: {
        type: String,
        default: '',
        trim: true
    },
    first_name: {
        type: String,
        default: '',
        trim: true
    },
    last_name: {
        type: String,
        default: '',
        trim: true
    },
    last_updated_on: {
        type: Date,
        default: Date.now
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
UserSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('first_name', 'first_name').exec(cb);
    }
};

mongoose.model('User', UserSchema);