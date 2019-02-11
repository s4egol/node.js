const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const newsName = "News";
const newsSchema = new Schema({
    order: Number,
    name: String,
    url: String
});

module.exports = { newsName, newsSchema }