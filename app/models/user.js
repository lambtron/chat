'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    moment = require('moment'),
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
    },
    refreshLastUpdatedOn: function(arr, cb) {
        var new_arr = [];
        for (var i = arr.length - 1; i >= 0; i--) {
            var obj = {};
            obj.phone_number = arr[i];
            new_arr.push(obj);
        };

        var new_date = new Date();

        // Retrieve all messages where either the 'to' or the 'from' matches any phone numbers in
        // the array.
        var query = this.find({});
        query.or(new_arr);
        console.log('query:')
        console.log(query);
        return query.update( {last_updated_on: new_date}).exec(cb);
    }
}

mongoose.model('User', UserSchema);