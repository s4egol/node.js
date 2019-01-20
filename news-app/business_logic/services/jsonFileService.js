const fs = require('fs');
const util = require('util');
const { logger } = require('../../logger/winston-logger.js');

class JsonFileService {

    constructor(jsonFilePath) {
        this.path = jsonFilePath;

        this.readFileAsync = util.promisify(fs.readFile);
        this.writeFileAsync = util.promisify(fs.writeFile);
    }

    async read() {
        logger.info(`Read data from file: '${this.path}'`);

        return await this.readFileAsync(this.path, 'utf-8');
    }

    async write(data) {
        logger.info(`Write data to file: '${this.path}'`);

        await this.writeFileAsync(this.path, JSON.stringify(data));
    }
}

module.exports = { JsonFileService }