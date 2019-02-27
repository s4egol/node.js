const NewsRepository = require("../newsRepository").NewsRepository;

const chai = require("chai");
const expect = chai.expect;
const repInstance = new NewsRepository();
const mongoose = require('mongoose');

const connectionString = require('../../../config/keys').ConnectionString;
mongoose.connect(connectionString, { useNewUrlParser: true});

describe('class NewsRepository', () => {

    describe('function createItem', () => {
        it('Should insert new item on db', (done) => {
            const insertName = "TestName";
            const expectedName = insertName;
    
            repInstance.createItem({name: insertName, url: "https://test.url.com"})
                .then(res => {
                    repInstance.readItem()
                        .then(items => {
                            let maxId = 0;
                            items.map(x => {
                                if (x.order > maxId){
                                    maxId = x.order;
                                }
                            })
                    
                            let item = items.filter(x => x.order == maxId)[0];
                            expect(item.name).contain(expectedName);
                            done();
                        })
                        .catch(err => done(new Error()));
                })
                .catch(err => done(new Error()));  
        });
    });

    describe('function deleteItem', () => {
        it('Should return error with negative value', (done) => {
            repInstance.deleteItem(-1)
                .then(response => done(new Error()))
                .catch(err => {
                    if (err) {
                        done();
                    }
                })
        });

        it('Should return error for input params with other type', (done) => {
            repInstance.deleteItem("string")
                .then(response => done(new Error()))
                .catch(err => {
                    if (err) {
                        done();
                    }
                })
        });

        it('Should delete item from db', (done) => {
            repInstance.readItem().then(items => {
                var item = items.filter(x => x.order)[0];
                const id = +item.order;
                repInstance.deleteItem(id)
                    .then(res => {
                        repInstance.readItem(id)
                            .then(item => {
                                if (!item){
                                    done();
                                }
                            });
                    });
            });
        });
    });

    describe('function updateItem', () => {
        it('Should return error with incorrect update information', (done) => {
            repInstance.updateItem(1, null)
                .then(response => done(new Error()))
                .catch(err => {
                    if (err) {
                        done();
                    }
                })
        });
    
        it('Should return error with incorrect id', (done) => {
            repInstance.updateItem("string", {})
                .then(response => done(new Error()))
                .catch(err => {
                    if (err) {
                        done();
                    }
                })
        });

        it('Should update item info on db', (done) => {
            repInstance.readItem().then(items => {
                var item = items.filter(x => x.order)[0];
                const id = +item.order;
                const newName = item.name + "1";
                const updateInfo = {name: newName, url: item.url};
                repInstance.updateItem(id, updateInfo)
                    .then(res => {
                        repInstance.readItem(id)
                            .then(item => {
                                done();
                            });
                    });
            });
        });
    });
});