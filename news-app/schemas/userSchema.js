const mongoose = require('mongoose');
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

const User = mongoose.model(userName, userSchema)

module.exports = User;