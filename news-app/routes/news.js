const express = require('express');
const bodyParser = require("body-parser");
const createError = require('http-errors');
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

router.get('/', async (request, response, next) => {
    logger.info(`GET request to ${request.hostname}${request.baseUrl}`);

    try {
        const data = await jsonRepository.readItem();       
        response.send(data);
    }
    catch (err) {
        logger.error(err);
        return next(createError(500));
    }
});

router.get('/:id', async (request, response, next) => {
    logger.info(`GET request to ${request.hostname}${request.baseUrl}`);

    try {
        const item = await jsonRepository.readItem(request.params.id);
        
        if (item != null){
            response.send(item);
        }
        
        return next(createError(404));
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
        await jsonRepository.createItem(newContent);
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

    let newContent = { name: request.body.name, url: request.body.url };

    try {
        if (await jsonRepository.updateItem(request.params.id, newContent)) {
            response.send(`Updated entity with id: '${request.params.id}'`);
        }
        
        return next(createError(404));
    }
    catch (err) {
        logger.error(err);
        return next(createError(500));
    }
});

router.delete('/:id', async (request, response, next) => {
    logger.info(`DELETE request to ${request.hostname}${request.baseUrl}`);

    try {
        if (await jsonRepository.deleteItem(request.params.id)) {
            response.send(`News with id: '${request.params.id}' was deleted`);
        }
        
        return next(createError(404));
    }
    catch (err) {
        logger.error(err);
        return next(createError(500));
    }
});

module.exports = router;