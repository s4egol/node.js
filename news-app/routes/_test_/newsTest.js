const chai = require('chai'),
      chaiHttp = require('chai-http'),
      expect = chai.expect,
      sinon = require('sinon'),
      NewsRepository = require('../../business_logic/repositories/newsRepository').NewsRepository;

chai.use(chaiHttp);

const url = 'http://localhost:3000',
      requester = chai.request.agent(url);

describe("News API", () => {
    describe("GET requests", () => {
        it("should get content from db", (done) => {
            requester.get('/news')
                .end((err, res) => {
                    if (!err && res){
                        done();
                    }
                });
        });

        it("should get status 302 by incorrect id", (done) => {
            requester.get('/news/qweqwe')
                .end((err, res) => {
                    expect(res).to.have.status(302);
                    done();
                });
        });
    });

    describe("POST requests", () => {
        it("should get status 302 (fail url validation)", (done) => {
            requester.post('/news')
                .set('content-type', 'application/json')
                .send({name: "abcde", url: "abcde"})
                .end((err, res) => {
                    expect(res).to.have.status(302);
                    done();
                });
        });

        it("should get status 302 (fail name length)", (done) => {
            requester.post('/news')
                .set('content-type', 'application/json')
                .send({name: "a", url: "https://translate.google.com"})
                .end((err, res) => {
                    expect(res).to.have.status(302);
                    done();
                });
        });

        it("should insert on db new item", (done) => {
            requester.post('/news')
                .set('content-type', 'application/json')
                .send({name: "newItem", url: "https://test.url.com"})
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});