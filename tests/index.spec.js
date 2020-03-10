const expect = require('chai').expect;
const request = require('request');

describe('Main requests: /*', () => {
    it('Request successful: GET * (React page)', done => {
        request('http://localhost:4000', function (err, res, body) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });
});
