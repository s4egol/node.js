const mongoose = require('mongoose');
const { logger } = require('../../logger/winston-logger.js');
const shema = require('../../schemas/newsSchema.js');
const News = require('../../schemas/newsSchema.js');

class NewsRepository {
    async createItem(item) {
        if (!item) {
            throw new Error();
        }

        var objects = await this.readItem();
        var maxOrder = 0;
        objects.map(x => {
            if (x.order > maxOrder){
                maxOrder = x.order;
            }
        })       

        const newNews = new News({
            order: maxOrder + 1,
            name: item.name,
            url: item.url
        });
            
        return await News.create(newNews)
            .then((err, obj) => {
                if (err){
                    throw new Error(err);
                }

                return true;
            })
            .catch(err => false);
    }

    async readItem(itemId){
        if (!itemId){
            return await News.find({}, (err, obj) => {
                return obj;
            })
            .catch(err => null);
        }

        return await News.find({order: itemId}, (err, obj) => {
            return obj;
        })
        .catch(err => null);;
    }

    async updateItem(itemId, newContent) {
        if (!newContent || typeof itemId !== number){
            throw new Error("Not supported input param");
        }

        return await News.updateOne(
            { order: itemId }, 
            { $set: { name: newContent.name, url: newContent.url } },
            (err, obj) => {
                if (err){
                    throw new Error(err);
                }

                return obj;
            })
            .catch(err => null);;
    }

    async deleteItem(itemId) {
        if (typeof itemId !== number || itemId <= 0) {
            throw new Error("Not supported input param");
        }

        return await News.deleteOne({order: itemId}, (err, obj) => {
            if (err){
                throw new Error(err);
            }

            return obj;
        });
    }
}

module.exports = { NewsRepository }