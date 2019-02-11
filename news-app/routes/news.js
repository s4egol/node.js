const express = require('express');
const bodyParser = require("body-parser");
const createError = require('http-errors');
const wrap = require('async-middleware').wrap;
const { logger } = require('../logger/winston-logger.js');
const { JsonFileRepository } = require('../business_logic/repositories/jsonFileRepository.js');
const { NewsRepository } = require('../business_logic/repositories/newsRepository.js')
const { check, validationResult } = require('express-validator/check');

const app = express();
const router = express.Router();

const jsonFilePath = './storee/news.json';
const jsonRepository = new JsonFileRepository(jsonFilePath);

const validateBody = () => {
    return [
        check('url').isURL(),
        check('name').isLength({ min: 3 })
    ];
}

app.use(wrap(function (req, res) {
    return Promise.reject(x => {
        logger.error(x);
        next(createError(500));
    })
}));

router.use(express.json());

router.get('/', async (request, response, next) => {
    logger.info(`GET request to ${request.hostname}${request.baseUrl}`);

    const data = await new NewsRepository().readItem();       
    response.send(data);
});

router.get('/:id', wrap(async (request, response, next) => {
    logger.info(`GET request to ${request.hostname}${request.baseUrl}/${request.params.id}`);

    const item = await new NewsRepository().readItem(request.params.id);
    
    if (item != null){
        response.send(item);
    }
    
    return next(createError(404));
}));

router.post('/', validateBody(), wrap(async (request, response, next) => {
    logger.info(`POST request to ${request.hostname}${request.baseUrl}`);
    
    if (!validationResult(request).isEmpty()) {
        return next(createError(422));
    }

    let newContent = { name: request.body.name, url: request.body.url };

    await new NewsRepository().createItem(newContent);
    response.send(`Added new content with name ${newContent.name}`);
}));

router.put('/:id', validateBody(), wrap(async (request, response, next) => {
    logger.info(`PUT request to ${request.hostname}${request.baseUrl}`);

    if (!validationResult(request).isEmpty()) {
        return next(createError(422));
    }

    let newContent = { name: request.body.name, url: request.body.url };

    if (await new NewsRepository().updateItem(request.params.id, newContent)) {
        response.send(`Updated entity with id: '${request.params.id}'`);
    }
    
    return next(createError(404));
}));

router.delete('/:id', wrap(async (request, response, next) => {
    logger.info(`DELETE request to ${request.hostname}${request.baseUrl}`);

    if (await new NewsRepository().deleteItem(request.params.id)) {
        response.send(`News with id: '${request.params.id}' was deleted`);
    }
    
    return next(createError(404));
}));

module.exports = router;