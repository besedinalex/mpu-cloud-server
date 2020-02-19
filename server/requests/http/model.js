const express = require('express');
const generator = require('generate-password');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');
const multer = require('multer');

const token = require('../http/token');
const userData = require('../db/user');
const groupData = require('../db/group');
const modelData = require('../db/model');

const upload = multer({storage: multer.memoryStorage()});
const model = express.Router();

const tempPath = __dirname.replace('/requests/http', '');

function checkAccess(userId, groupId, modelId, res, callback) {
    userData.getUserModels(userId).then(userModels => {
        let found = false;
        for (let model of userModels) {
            if (model.model_id == modelId && model.ownerUser == userId) {
                found = true;
                callback(model);
            }
        }
        if (!found) {
            groupData.getGroup(userId, groupId).then(group => {
                if (group.length === 0) {
                    res.status(401).send();
                } else {
                    groupData.getGroupModels(groupId).then(groupModels => {
                        for (let model of groupModels) {
                            if (model.model_id == modelId && model.ownerGroup == groupId) {
                                callback(model);
                            }
                        }
                    })
                }
            })
        }
    })
}

function convertModel(token, fullPathOrig, exportFormat, callback) {
    request({
        method: 'POST',
        url: `http://195.133.144.86:4001/model?token=${token}&exportFormat=${exportFormat}`,
        headers: {'Content-Type': 'multipart/form-data'},
        formData: {'model': fs.createReadStream(fullPathOrig)}
    }, function (err, response, data) {
        callback(err, response, data);
    });
}

model.get('/original/:id', token.check, function (req, res) {
    checkAccess(req.user_id, req.query.groupId, req.params.id, res, model => {
        convertModel(req.query.token, model.originalPath, req.query.format, (err, response, data) => {
            if (response === undefined ||response.statusCode === 500) {
                res.status(500).send(data);
            } else {
                const path = path.join(tempPath, 'storage/temp');
                fs.writeFile(path, data, () => res.download(path, `${model.title}.${format}`));
            }
        });
    });
});

model.post('/original', [token.check, upload.single('model')], function (req, res) {
    const body = req.body;
    const file = req.file;

    if (!body || !file) {
        console.error('Bad Request. File is required!');
        res.status(500).send('Bad request!');
        return;
    }

    const modelCode = generator.generate({length: 20, numbers: true});
    const cellPath = path.join(tempPath, 'storage', modelCode);

    const fileNamePreview = modelCode + '.jpg';
    const fullPathPreview = path.join(tempPath, 'storage/preview', fileNamePreview);
    fs.outputFileSync(fullPathPreview, null);

    const fileNameOrig = modelCode + path.extname(file.originalname);
    const fullPathOrig = path.join(cellPath, fileNameOrig);
    fs.outputFileSync(fullPathOrig, file.buffer, {flag: 'wx'});

    const fileNameGLTF = modelCode + '.gltf';
    const fullPathGLTF = path.join(cellPath, fileNameGLTF);

    convertModel(req.query.token, fullPathOrig, 'gltf', (err, response, data) => {
        if (response.statusCode === 500) {
            fs.unlink(fullPathOrig);
            res.status(500).send(data);
        } else {
            fs.outputFileSync(fullPathGLTF, data, {flag: 'wx'});
            modelData.addModel(
                body.title, body.desc, file.originalname,
                fullPathGLTF.replace(/\\/g, '/'),
                fullPathOrig.replace(/\\/g, '/'),
                fileNamePreview,
                file.size, path.extname(file.originalname).split('.')[1], req.user_id, body.groupId
            ).then(data => res.json(data));
        }
    });
});

model.delete('/original/:id', token.check, (req, res) => {
    checkAccess(req.user_id, req.query.groupId, req.params.id, res, model => {
        fs.unlink(model.originalPath);
        fs.unlink(model.gltfPath);
        modelData.removeModel(req.params.id, req.user_id).then(deleted => res.json({deleted}))
    });
});

model.get('/view/:id', token.check, function (req, res) {
    checkAccess(req.user_id, req.query.groupId, req.params.id, res, model =>
        res.json({model: JSON.parse(fs.readFileSync(model.gltfPath))})
    );
});

model.post('/preview/:id', [token.check, upload.single('canvasImage')], function (req, res) {
    checkAccess(req.user_id, req.query.groupId, req.params.id, res,model => {
        const previewPath = path.join(tempPath, 'storage/preview', model.previewPath);
        fs.writeFile(previewPath, req.file.buffer, () => res.sendStatus(200))
    });
});

module.exports = model;
