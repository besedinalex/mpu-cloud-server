const express = require('express');
const generator = require('generate-password');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');
const multer = require('multer');
const token = require('../http/token');
const userData = require('../db/user');
const groupData = require('../db/group');
const fileData = require('../db/file');

const files = express.Router();
const upload = multer({storage: multer.memoryStorage()});

const filesPath = path.join(__dirname.replace('/requests/http', ''), 'storage'); // Temp

// Checks if it's user file or from his groups
function checkAccess(userId, groupId, fileId, res, callback) {
    userData.getUserFiles(userId).then(userFiles => {
        let found = false;
        for (let file of userFiles) {
            if (file.file_id == fileId && file.ownerUser == userId) {
                found = true;
                callback(file);
            }
        }
        if (!found) {
            groupData.getGroup(userId, groupId).then(group => {
                if (group.length === 0) {
                    res.status(401).send();
                } else {
                    groupData.getGroupFiles(groupId).then(groupFiles => {
                        for (let file of groupFiles) {
                            if (file.file_id == fileId && file.ownerGroup == groupId) {
                                callback(file);
                            }
                        }
                    })
                }
            })
        }
    })
}

// Sends model to converter and await for converted one
function convertModel(token, modelPath, exportFormat, callback) {
    request({
        method: 'POST',
        url: `http://195.133.144.86:4001/model?token=${token}&exportFormat=${exportFormat}`,
        headers: {'Content-Type': 'multipart/form-data'},
        formData: {'model': fs.createReadStream(modelPath)}
    }, function (err, response, data) {
        callback(err, response, data);
    });
}

// Download file from server
files.get('/original/:id', token.check, function (req, res) {
    checkAccess(req.user_id, req.query.groupId, req.params.id, res, file => {
        const format = req.query.format.toLowerCase();
        const filePath = path.join(filesPath, file.code, file.code + '.' + format);
        if (fs.existsSync(filePath)) {
            res.download(filePath, `${file.title}.${format}`);
        } else {
            const origPath = filePath.replace('.' + format, '.' + file.format);
            convertModel(req.query.token, origPath, req.query.format, (err, response, data) => {
                if (response === undefined || response.statusCode === 500) {
                    res.status(500).send();
                } else {
                    fs.writeFile(filePath, data, () => res.download(filePath, `${file.title}.${format}`));
                }
            });
        }
    });
});

// Uploading file to server
files.post('/original', [token.check, upload.single('model')], function (req, res) {
    const body = req.body;
    const file = req.file;

    if (!body || !file) {
        console.error('Bad Request. File is required!');
        res.status(500).send('Bad request!');
        return;
    }

    const modelCode = generator.generate({length: 20, numbers: true});
    const folderPath = path.join(filesPath, modelCode);

    const fileNameOrig = modelCode + path.extname(file.originalname);
    const fullPathOrig = path.join(folderPath, fileNameOrig);
    fs.outputFileSync(fullPathOrig, file.buffer, {flag: 'wx'});

    const fileNamePreview = modelCode + '.jpg';
    const fullPathPreview = path.join(folderPath, fileNamePreview);
    fs.outputFileSync(fullPathPreview, null);

    // Checks if PDF. PDF is added as is. 3D models are converted.
    if (path.extname(file.originalname).split('.')[1].toLowerCase() === 'pdf') {
        fileData.addFile(
            body.title, body.desc, file.originalname, modelCode, file.size,
            path.extname(file.originalname).split('.')[1], req.user_id, body.groupId
        ).then(data => res.json(data));
    } else {
        const fileNameGLTF = modelCode + '.gltf';
        const fullPathGLTF = path.join(folderPath, fileNameGLTF);

        convertModel(req.query.token, fullPathOrig, 'gltf', (err, response, data) => {
            if (response.statusCode === 500) {
                fs.removeSync(folderPath);
                res.status(500).send(data);
            } else {
                fs.outputFileSync(fullPathGLTF, data, {flag: 'wx'});
                fileData.addFile(
                    body.title, body.desc, file.originalname, modelCode, file.size,
                    path.extname(file.originalname).split('.')[1], req.user_id, body.groupId
                ).then(data => res.json(data));
            }
        });
    }
});

// Removing file from server
files.delete('/original/:id', token.check, (req, res) => {
    checkAccess(req.user_id, req.query.groupId, req.params.id, res, file => {
        fs.removeSync(path.join(filesPath, file.code));
        fileData.removeFile(req.params.id, req.user_id).then(deleted => res.json({deleted}));
    });
});

// Downloading file for viewer
files.get('/view/:id', token.check, function (req, res) {
    checkAccess(req.user_id, req.query.groupId, req.params.id, res, model => {
        const modelPath = path.join(filesPath, model.code, model.code + '.' + req.query.format);
        res.json({model: JSON.parse(fs.readFileSync(modelPath))});
    });
});

// Adding preview of file
files.post('/preview/:id', [token.check, upload.single('canvasImage')], function (req, res) {
    checkAccess(req.user_id, req.query.groupId, req.params.id, res,file => {
        const previewPath = path.join(filesPath, file.code, file.code + '.jpg');
        fs.writeFile(previewPath, req.file.buffer, () => res.sendStatus(200))
    });
});

module.exports = files;
