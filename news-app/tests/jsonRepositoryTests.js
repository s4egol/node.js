const JsonFileRepository = require("../business_logic/repositories/jsonFileRepository").JsonFileRepository;

const chai = require("chai");
const expect = chai.expect;
const repInstance = new JsonFileRepository();

describe('JsonFileRepository testing', () => {
    it('Testing deleteItem function input params by type', (done) => {
        repInstance.deleteItem("wrong param")
            .then(response => done(new Error()))
            .catch(err => {
                if (err) {
                    done();
                }
            })
    });

    it('Testing createItem function with incorrect input argument', (done) => {
        repInstance.createItem("wrong param")
            .then(response => done(new Error()))
            .catch(err => {
                if (err) {
                    done();
                }
            })
    });

    it('Testing updateItem function for incorrect type of id', (done) => {
        repInstance.updateItem(null, {})
            .then(response => done(new Error()))
            .catch(err => {
                if (err) {
                    done();
                }
            })
    });
});