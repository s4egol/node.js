const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create')
var Schema = mongoose.Schema;

const userName = "Users";
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.plugin(findOrCreate);

const User = mongoose.model(userName, userSchema)
module.exports = User;