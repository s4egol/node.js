const express = require('express');
const bodyParser = require("body-parser");
const createError = require('http-errors');
const { logger } = require('../logger/winston-logger.js');
const { JsonFileRepository } = require('../business_logic/services/jsonFileRepository.js');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
const jsonParser = bodyParser.json();

const jsonFilePath = './store/news.json';
const jsonService = new JsonFileRepository(jsonFilePath);

const validateBody = () => {
    return [
        check('url').isURL(),
        check('name').isLength({ min: 3 })
    ];
}

router.use(express.json());

router.get('/', async (request, response, next) => {
    logger.info(`GET request to ${request.hostname}${request.baseUrl}`);

    try {
        const content = await jsonService.read();
        const obj = JSON.parse(content);
        
        response.send(obj);
    }
    catch (err) {
        logger.error(err);
        return next(createError(500));
    }
});

router.get('/:id', async (request, response, next) => {
    logger.info(`GET request to ${request.hostname}${request.baseUrl}`);

    try {
        const content = await jsonService.read();
        const news = JSON.parse(content);

        for(let i = 0; i < news.length; i++) {
            if (news[i].id == request.params.id) {
                response.send(news[i]);
            }
        }

        next(createError(404));
    }
    catch (err) {
        logger.error(err);
        return next(createError(500));
    }
});

router.post('/', validateBody(), async (request, response, next) => {
    logger.info(`POST request to ${request.hostname}${request.baseUrl}`);
    
    if (!validationResult(request).isEmpty()) {
        return next(createError(422));
    }

    let newContent = { name: request.body.name, url: request.body.url };

    try {
        const content = await jsonService.read();
        let news = JSON.parse(content);
        const maxId = Math.max.apply(Math, news.map( x => x.id));
        newContent.id = maxId ? maxId + 1 : 1;
        news.push(newContent);

        await jsonService.write(news);
        response.send(`Added new content with name ${newContent.name}`);
    }
    catch (err) {
        logger.error(err);
        return next(createError(500));
    }
});

router.put('/:id', validateBody(), async (request, response, next) => {
    logger.info(`PUT request to ${request.hostname}${request.baseUrl}`);

    if (!validationResult(request).isEmpty()) {
        return next(createError(422));
    }

    try {
        const content = await jsonService.read();
        let news = JSON.parse(content);

        let entityToUpdate;
        for(let i = 0; i < news.length; i++) {
            if (news[i].id == request.params.id) {
                entityToUpdate = news[i];
                break;
            }
        }

        if (entityToUpdate) {
            entityToUpdate.name = request.body.name;
            entityToUpdate.url = request.body.url;

            await jsonService.write(news);
            response.send(`Updated entity with id: '${request.params.id}'`);
        }
        else {
            return next(createError(404));
        }
    }
    catch (err) {
        logger.error(err);
        return next(createError(500));
    }
});

router.delete('/:id', async (request, response, next) => {
    logger.info(`DELETE request to ${request.hostname}${request.baseUrl}`);

    try {
        const content = await jsonService.read();
        let news = JSON.parse(content);
        const felteredNews = news.filter(x => x.id != request.params.id);

        if (felteredNews.length == news.length){
            response.send(`News with id: '${request.params.id}' not found`);
        }
        else {
            await jsonService.write(felteredNews);
            response.send(`News with id: '${request.params.id}' was deleted`);
        }
    }
    catch (err) {
        logger.error(err);
        return next(createError(500));
    }
});

module.exports = router;