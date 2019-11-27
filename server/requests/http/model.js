const generator = require('generate-password');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');

const userData = require('../db/user');
const groupData = require('../db/group');
const modelData = require('../db/model');

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

exports.downloadModel = function (userId, groupId, format, token, dirname, modelId, res) {
    checkAccess(userId, groupId, modelId, res, model => {
        convertModel(token, model.originalPath, format, (err, response, data) => {
            if (response.statusCode === 500) {
                res.status(500).send(data);
            } else {
                const tempPath = path.join(dirname, 'storage/temp');
                fs.writeFile(tempPath, data, () => res.download(tempPath, `${model.title}.${format}`));
            }
        });
    });
};

exports.getModel = function (userId, groupId, modelId, res) {
    checkAccess(userId, groupId, modelId, res, model =>
        res.json({model: JSON.parse(fs.readFileSync(model.gltfPath))})
    );
};

exports.addModel = function (userId, token, body, file, dirname, res) {
    if (!body || !file) {
        console.error('Bad Request. File is required!');
        res.status(500).send('Bad request!');
        return;
    }

    const modelCode = generator.generate({length: 20, numbers: true});
    const cellPath = path.join(dirname, 'storage', modelCode);

    const fileNamePreview = modelCode + '.jpg';
    const fullPathPreview = path.join(dirname, 'storage/preview', fileNamePreview);
    fs.outputFileSync(fullPathPreview, null);

    const fileNameOrig = modelCode + path.extname(file.originalname);
    const fullPathOrig = path.join(cellPath, fileNameOrig);
    fs.outputFileSync(fullPathOrig, file.buffer, {flag: 'wx'});

    const fileNameGLTF = modelCode + '.gltf';
    const fullPathGLTF = path.join(cellPath, fileNameGLTF);

    convertModel(token, fullPathOrig, 'gltf', (err, response, data) => {
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
                file.size, path.extname(file.originalname).split('.')[1], userId, body.groupId
            ).then(data => res.json(data));
        }
    });
};

exports.addModelPreview = function(userId, groupId, modelId, body, dirname, res) {
    checkAccess(userId, groupId, modelId, res,model => {
        const previewPath = path.join(dirname, 'storage/preview', model.previewPath);
        fs.writeFile(previewPath, body.buffer, () => res.sendStatus(200))
    });
};

exports.deleteModel = function (userId, groupId, modelId, res) {
    checkAccess(userId, groupId, modelId, res, model => {
        fs.unlink(model.originalPath);
        fs.unlink(model.gltfPath);
        modelData.removeModel(modelId, userId).then(deleted => res.json({deleted}))
    })
};
