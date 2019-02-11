const mongoose = require('mongoose');
const { logger } = require('../../logger/winston-logger.js');
const shema = require('../../schemas/newsSchema.js');

class NewsRepository {
    constructor() {
        mongoose.connect("mongodb://localhost:27017/newsApp", { useNewUrlParser: true });
    }

    async createItem(item) {
        const News = mongoose.model(shema.newsName, shema.newsSchema);

        return await News.findOne().sort('-order')
            .exec(async (err, obj) =>
            {
                var max = !obj.order ? 1 : obj.order + 1;

                const newNews = new News({
                    order: max,
                    name: item.name,
                    url: item.url
                });
                
                return await newNews.save().then((err, obj) => {
                    mongoose.disconnect();

                    if (err){
                        throw new Error(err);
                    }

                    return obj;
                })
            });         
    }

    async readItem(itemId){
        const News = mongoose.model(shema.newsName, shema.newsSchema);

        if (!itemId){
            return await News.find({}, (err, obj) => {
                mongoose.disconnect();
                return obj;
            });
        }

        return await News.find({order: itemId}, (err, obj) => {
            mongoose.disconnect();
            return obj;
        });
    }

    async updateItem(itemId, newContent) {
        const News = mongoose.model(shema.newsName, shema.newsSchema);

        return await News.updateOne(
            { order: itemId }, 
            { $set: { name: newContent.name, url: newContent.url } },
            (err, obj) => {
                mongoose.disconnect();

                if (err){
                    throw new Error(err);
                }

                return obj;
            });
    }

    async deleteItem(itemId) {
        const News = mongoose.model(shema.newsName, shema.newsSchema);

        return await News.deleteOne({order: itemId}, (err, obj) => {
            mongoose.disconnect();

            if (err){
                throw new Error(err);
            }

            return obj;
        });
    }
}

module.exports = { NewsRepository }