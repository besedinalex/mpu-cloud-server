const expect = require('chai').expect;
const crypto = require('./../src/crypto');

describe('Crypto', function () {
    it('Encrypts text', function (done) {
        const textToEncrypt = 'Arhipov';
        const encryptedText = crypto.encrypt(textToEncrypt);
        const regExp = /Arhipov/;
        expect(encryptedText.search(regExp)).to.equal(-1);
        done();
    });

    it('Decrypts text', function (done) {
        expect(crypto.decrypt('e57f8d3208203d977df3bf00c1935032:a29427e1cc6c09')).to.equal('Arhipov');
        done();
    });
});
