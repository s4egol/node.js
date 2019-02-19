const express = require('express');
const passport = require('passport');
const createError = require('http-errors');
const wrap = require('async-middleware').wrap;
const { logger } = require('../logger/winston-logger.js');
const { JsonFileRepository } = require('../business_logic/repositories/jsonFileRepository.js');
const { NewsRepository } = require('../business_logic/repositories/newsRepository.js')
const { validationResult } = require('express-validator/check');
const { ensureAuthenticated } = require('../config/auth.js');
const { validateNewsBody } = require('../validation/paramsValidation.js');

const app = express();
const router = express.Router();

app.use(wrap(function (req, res) {
    return Promise.reject(x => {
        logger.error(x);
        next(createError(500));
    })
}));

router.use(express.json());

router.get('/', wrap(async (req, res, next) => {
    logger.info(`GET request to ${req.hostname}${req.baseUrl}`);

    const data = await new NewsRepository().readItem();       
    res.send(data);
}));

router.get('/:id', wrap(async (request, response, next) => {
    logger.info(`GET request to ${request.hostname}${request.baseUrl}/${request.params.id}`);

    const item = await new NewsRepository().readItem(request.params.id);
    
    if (item != null){
        response.send(item);
    }
    
    return next(createError(404));
}));

router.post('/', validateNewsBody(), wrap(async (request, response, next) => {
    logger.info(`POST request to ${request.hostname}${request.baseUrl}`);
    
    if (!validationResult(request).isEmpty()) {
        return next(createError(422));
    }

    let newContent = { name: request.body.name, url: request.body.url };

    await new NewsRepository().createItem(newContent);
    response.send(`Added new content with name ${newContent.name}`);
}));

router.put('/:id', validateNewsBody(), wrap(async (request, response, next) => {
    logger.info(`PUT request to ${request.hostname}${request.baseUrl}`);
    ensureAuthenticated(request, response, next);

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
    ensureAuthenticated(request, response, next);

    if (await new NewsRepository().deleteItem(request.params.id)) {
        response.send(`News with id: '${request.params.id}' was deleted`);
    }
    
    return next(createError(404));
}));

module.exports = router;