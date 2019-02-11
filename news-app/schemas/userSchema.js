const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userName = "Users";
const userSchema = new Schema({
    username: String,
    password: String
});

module.exports = { userName, userSchema }