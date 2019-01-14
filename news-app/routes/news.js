var express = require('express');
var fs = require('fs');
var router = express.Router();

const jsonFilePath = '../store/news.json';

router.use(express.json());

router.get('/', (request, response, next) => {
    const news = readJSONFile();
    response.send(news);
});

router.get('/:id', function(request, response, next) {
    response.send(newsJson);
});

router.post('/:id', (request, response, next) => {

});

router.put('/:id', (request, response, next) => {

});

router.delete('/:id', (request, response, next) => {

});

function readJSONFile() {
    let news = [];

    fs.readFile(jsonFilePath, function (err, data) {
        if (err) {
            throw new Error(`Error of processing json file with destination ${jsonFilePath}`)
        }
    
        var obj = JSON.parse(data);
        news.push(obj);
    });

    return news;
}

module.exports = router;