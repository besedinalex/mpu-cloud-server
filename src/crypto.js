////////////////////////////
////// Модуль шифрования и дешифрования алгоритмом AES-256
////////////////////////////

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const password = 'MPU';

exports.encrypt = function(decryptedText) {
    const cipher = crypto.createCipher(algorithm, password)
    let crypted = cipher.update(decryptedText, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
};

exports.decrypt = function(cryptedText) {
    const decipher = crypto.createDecipher(algorithm, password)
    let dec = decipher.update(cryptedText, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
};