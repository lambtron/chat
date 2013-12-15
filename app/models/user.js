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
        default: Date.now,
        trim: true
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
            var obj2 = {};
            obj.to = arr[i];
            obj2.from = arr[i];
            new_arr.push(obj, obj2);
        };

        // Retrieve all messages where either the 'to' or the 'from' matches any phone numbers in
        // the array.
        var query = this.find({});
        var new_date = new Date();
        query.or(arr);
        console.log(query);
        return query.update( {last_updated_on: new_date}).exec(cb);
    }
}

mongoose.model('User', UserSchema);