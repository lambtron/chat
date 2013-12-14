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
 * Statics
 */
UserSchema.statics = {
    getAllUsers: function(cb) {
        return this.find().exec(cb);
    }
};

mongoose.model('User', UserSchema);