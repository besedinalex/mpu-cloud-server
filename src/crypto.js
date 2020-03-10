const crypto = require('crypto');

const encryptionKey = 'rcM8aadrTuZen8MB3RUKVjMbogUO82gq'; // Random 32 chars
const ivLength = 16; // Always 16 for AES
const algorithm = 'aes-256-ctr';

exports.encrypt = function(text) {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey), iv);
    const encrypted =  Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

exports.decrypt = function(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
};
