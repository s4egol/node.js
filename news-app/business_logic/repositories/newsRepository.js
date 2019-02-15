const mongoose = require('mongoose');
const { logger } = require('../../logger/winston-logger.js');
const shema = require('../../schemas/newsSchema.js');
const News = require('../../schemas/newsSchema.js');

class NewsRepository {
    async createItem(item) {
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
                    if (err){
                        throw new Error(err);
                    }

                    return obj;
                })
            });         
    }

    async readItem(itemId){
        if (!itemId){
            return await News.find({}, (err, obj) => {
                return obj;
            });
        }

        return await News.find({order: itemId}, (err, obj) => {
            return obj;
        });
    }

    async updateItem(itemId, newContent) {
        return await News.updateOne(
            { order: itemId }, 
            { $set: { name: newContent.name, url: newContent.url } },
            (err, obj) => {
                if (err){
                    throw new Error(err);
                }

                return obj;
            });
    }

    async deleteItem(itemId) {
        return await News.deleteOne({order: itemId}, (err, obj) => {
            if (err){
                throw new Error(err);
            }

            return obj;
        });
    }
}

module.exports = { NewsRepository }