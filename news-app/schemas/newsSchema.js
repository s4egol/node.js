const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const newsName = "News";
const newsSchema = new Schema({
    order: Number,
    name: String,
    url: String
});

const News =  mongoose.model(newsName, newsSchema);

module.exports = News;