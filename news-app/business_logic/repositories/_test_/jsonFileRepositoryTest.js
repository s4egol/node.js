const JsonFileRepository = require("../jsonFileRepository").JsonFileRepository;

const chai = require("chai");
const expect = chai.expect;
const repInstance = new JsonFileRepository();

describe('class JsonFileRepository', () => {
    describe('function deleteItem', () => {
        it('Should return error with incorrect input params by type', (done) => {
            repInstance.deleteItem("wrong param")
                .then(response => done(new Error()))
                .catch(err => {
                    if (err) {
                        done();
                    }
                })
        });
    });

    describe('function createItem', () => {
        it('Should return error with incorrect input argument', (done) => {
            repInstance.createItem("wrong param")
                .then(response => done(new Error()))
                .catch(err => {
                    if (err) {
                        done();
                    }
                })
        });
    });

    describe('function updateItem', () => {
        it('Should return error with incorrect type of id', (done) => {
            repInstance.updateItem(null, {})
                .then(response => done(new Error()))
                .catch(err => {
                    if (err) {
                        done();
                    }
                })
        });
    });
});