const express = require('express');
const bodyParser = require("body-parser");
const createError = require('http-errors');
const wrap = require('async-middleware').wrap;
const { logger } = require('../logger/winston-logger.js');
const { JsonFileRepository } = require('../business_logic/services/jsonFileRepository.js');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();

const jsonFilePath = './store/news.json';
const jsonRepository = new JsonFileRepository(jsonFilePath);

const validateBody = () => {
    return [
        check('url').isURL(),
        check('name').isLength({ min: 3 })
    ];
}

router.use(express.json());

router.get('/', wrap(async (request, response, next) => {
    logger.info(`GET request to ${request.hostname}${request.baseUrl}`);

    const data = await jsonRepository.readItem();       
    response.send(data);
}));

router.get('/:id', wrap(async (request, response, next) => {
    logger.info(`GET request to ${request.hostname}${request.baseUrl}`);

    const item = await jsonRepository.readItem(request.params.id);
    
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

    await jsonRepository.createItem(newContent);
    response.send(`Added new content with name ${newContent.name}`);
}));

router.put('/:id', validateBody(), wrap(async (request, response, next) => {
    logger.info(`PUT request to ${request.hostname}${request.baseUrl}`);

    if (!validationResult(request).isEmpty()) {
        return next(createError(422));
    }

    let newContent = { name: request.body.name, url: request.body.url };

    if (await jsonRepository.updateItem(request.params.id, newContent)) {
        response.send(`Updated entity with id: '${request.params.id}'`);
    }
    
    return next(createError(404));
}));

router.delete('/:id', wrap(async (request, response, next) => {
    logger.info(`DELETE request to ${request.hostname}${request.baseUrl}`);

    if (await jsonRepository.deleteItem(request.params.id)) {
        response.send(`News with id: '${request.params.id}' was deleted`);
    }
    
    return next(createError(404));
}));

module.exports = router;