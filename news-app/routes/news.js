const express = require('express');
const bodyParser = require("body-parser");
const createError = require('http-errors');
const { logger } = require('../logger/winston-logger.js');
const fs = require('fs');
const util = require('util');

const router = express.Router();
const jsonParser = bodyParser.json();

const jsonFilePath = './store/news.json';
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

router.use(express.json());

router.get('/', (request, response, next) => {
    logger.info(`GET request to ${request.hostname}${request.baseUrl}`);

    readFileAsync(jsonFilePath, 'utf-8')
        .then((content) => {
            const obj = JSON.parse(content);
            response.send(obj);
        })
        .catch((err) => {
            logger.error(err);
            next(createError(500));
        });
});

router.get('/:id', (request, response, next) => {
    logger.info(`GET request to ${request.hostname}${request.baseUrl}`);

    readFileAsync(jsonFilePath, 'utf-8')
        .then((content) => {
            const news = JSON.parse(content);
            for(var i = 0; i < news.length; i++) {
                if (news[i].id == request.params.id) {
                    response.send(news[i]);
                }
            }

            next(createError(404));
        })
        .catch((err) => {
            logger.error(err);
            next(createError(500));
        });
});

router.post('/', jsonParser, (request, response, next) => {
    logger.info(`POST request to ${request.hostname}${request.baseUrl}`);

    if (!request.body){
        logger.error(`request body not defined`);
        next(createError(404));
    }

    var newContent = { name: request.body.name, url: request.body.url };

    readFileAsync(jsonFilePath, 'utf-8')
        .then((content) => {
            var news = JSON.parse(content);
            var maxId = Math.max.apply(Math, news.map( x => x.id));
            newContent.id = maxId ? maxId + 1 : 1;
            
            news.push(newContent);
            writeFileAsync(jsonFilePath, JSON.stringify(news))
                .then(() => response.send(`Added new content with name ${newContent.name}`))
                .catch((err) => { 
                    logger.error(err);
                    next(createError(500))
                });
        })
        .catch((err) => {
            logger.error(err);
            next(createError(500));
        });
});

router.put('/:id', jsonParser, (request, response, next) => {
    logger.info(`PUT request to ${request.hostname}${request.baseUrl}`);

    if (!request.body){
        next(createError(404));
    }

    readFileAsync(jsonFilePath, 'utf-8')
        .then((content) => {
            let news = JSON.parse(content);

            let entityToUpdate;
            for(let i = 0; i < news.length; i++) {
                if (news[i].id == request.params.id){
                    entityToUpdate = news[i];
                    break;
                }
            }

            if (entityToUpdate) {
                entityToUpdate.name = request.body.name;
                entityToUpdate.url = request.body.url;

                writeFileAsync(jsonFilePath, JSON.stringify(news))
                    .then(() => response.send(`Updated entity with id: '${request.params.id}'`))
                    .catch(() => next(createError(500)));
            }
            else {
                next(createError(404));
            }
        })
        .catch(() => {
            logger.error(err);
            next(createError(500));
        });
});

router.delete('/:id', (request, response, next) => {
    logger.info(`DELETE request to ${request.hostname}${request.baseUrl}`);

    readFileAsync(jsonFilePath, 'utf-8')
        .then((content) => {
            var news = JSON.parse(content);
            felteredNews = news.filter(x => x.id != request.params.id);

            if (felteredNews.length == news.length){
                response.send(`News with id: '${request.params.id}' not found`)
            }
            else {
                writeFileAsync(jsonFilePath, JSON.stringify(felteredNews))
                    .then(() => {
                        response.send(`News with id: '${request.params.id}' was deleted`);
                    })
                    .catch((err) => { 
                        logger.error(err);
                        next(createError(500)); 
                    });
            }
        })
        .catch((err) => {
            logger.error(err);
            next(createError(500))
        });
});


module.exports = router;