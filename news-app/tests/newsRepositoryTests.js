const NewsRepository = require("../business_logic/repositories/newsRepository").NewsRepository;

const chai = require("chai");
const expect = chai.expect;
const repInstance = new NewsRepository();

describe('NewsRepository testing', () => {
    it('Testing deleteItem function for negative value', (done) => {
        repInstance.deleteItem(-1)
            .then(response => done(new Error()))
            .catch(err => {
                if (err) {
                    done();
                }
            })
    });

    it('Testing deleteItem function for input params with other type', (done) => {
        repInstance.deleteItem("string")
            .then(response => done(new Error()))
            .catch(err => {
                if (err) {
                    done();
                }
            })
    });

    it('Testing updateItem function without correct update information', (done) => {
        repInstance.updateItem(1, null)
            .then(response => done(new Error()))
            .catch(err => {
                if (err) {
                    done();
                }
            })
    });

    it('Testing updateItem function with incorrect id', (done) => {
        repInstance.updateItem("string", {})
            .then(response => done(new Error()))
            .catch(err => {
                if (err) {
                    done();
                }
            })
    });
});