const fs = require('fs');
const util = require('util');

class JsonFileRepository {

    constructor(jsonFilePath) {
        this.path = jsonFilePath;

        this.readFileAsync = util.promisify(fs.readFile);
        this.writeFileAsync = util.promisify(fs.writeFile);
    }

    async createItem(item) {

        const content = await this.readFileAsync(this.path, 'utf-8');
        let news = JSON.parse(content);
        const maxId = Math.max.apply(Math, news.map( x => x.id));
        item.id = maxId ? maxId + 1 : 1;

        news.push(item);
        return await this.writeFileAsync(this.path, JSON.stringify(news));
    }

    async readItem(itemId){
        const content = await this.readFileAsync(this.path, 'utf-8');
        const news = JSON.parse(content);

        if (itemId === undefined) {
            return news;
        }

        for(let i = 0; i < news.length; i++) {
            if (news[i].id == itemId) {
                return news[i];
            }
        }

        return null;
    }

    async updateItem(itemId, newContent) {
        const content = await this.readFileAsync(this.path, 'utf-8');
        let news = JSON.parse(content);

        let entityToUpdate;
        for(let i = 0; i < news.length; i++) {
            if (news[i].id == itemId) {
                entityToUpdate = news[i];
                break;
            }
        }

        if (entityToUpdate) {
            entityToUpdate.name = newContent.name;
            entityToUpdate.url = newContent.url;

            await this.writeFileAsync(this.path, JSON.stringify(news));
        }
        else {
            return false;
        }

        return true;
    }

    async deleteItem(itemId) {

        const content = await this.readFileAsync(this.path, 'utf-8');
        let news = JSON.parse(content);
        const felteredNews = news.filter(x => x.id != itemId);

        if (felteredNews.length == news.length){
            return false;
        }
        else {
            await this.writeFileAsync(this.path, JSON.stringify(felteredNews));
            return true;
        }
    }
}

module.exports = { JsonFileRepository }