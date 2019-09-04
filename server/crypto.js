
////////////////////////////
////// Модуль шифрования и дешифрования алгоритмом AES-256
////////////////////////////

const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'MPU';

exports.encrypt = function(decryptedText) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(decryptedText, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

exports.decrypt = function(cryptedText) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(cryptedText, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}