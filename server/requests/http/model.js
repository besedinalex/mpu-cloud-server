const generator = require('generate-password');
const path = require('path');
const fs = require('fs-extra');

const userData = require('../db/user');
const groupData = require('../db/group');
const modelData = require('../db/model');

exports.downloadModel = function (userId, modelId, res) {
    userData.getUserModels(userId).then(models => {
        for (let model of models) {
            if (model.model_id == req.params.id && model.owner == req.user_id) {
                console.log(model.originalPath)
                res.download(model.originalPath, model.filename);
            }
        }
    })
};

exports.getModel = function (userId, groupId, modelId, res) {
    userData.getUserModels(userId).then(userModels => {
        let found = false;
        for (let model of userModels) {
            if (model.model_id == modelId && model.ownerUser == userId) {
                found = true;
                let gltf = JSON.parse(fs.readFileSync(model.gltfPath));
                res.json({model: gltf})
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
                                let gltf = JSON.parse(fs.readFileSync(model.gltfPath));
                                res.json({model: gltf})
                            }
                        }
                    })
                }
            })
        }
    })
};

exports.addModel = function (userId, body, file, dirname, cad2gltf, res) {
    if (!body || !file) {
        console.error('Bad Request. File is required!');
        res.status(500).send('Bad request!');
        return;
    }

    let modelCode = generator.generate({length: 20, numbers: true});
    let cellPath = path.join(dirname, 'storage', modelCode); // Путь к физической папке

    let fileNameOrig = modelCode + path.extname(file.originalname);
    let fullPathOrig = path.join(cellPath, fileNameOrig);

    let fileNameGLTF = modelCode + '.gltf'; // Название файла
    let fullPathGLTF = path.join(cellPath, fileNameGLTF);

    console.log(body, file, fullPathGLTF);

    cad2gltf(file.buffer, (gltf, err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Import error!');
            return;
        }

        let plainGLTF = JSON.stringify(gltf);

        try {
            fs.outputFileSync(fullPathGLTF, plainGLTF, {flag: 'wx'});
            fs.outputFileSync(fullPathOrig, file.buffer, {flag: 'wx'});

            modelData.addModel(
                body.title, body.desc, file.originalname,
                fullPathGLTF.replace(/\\/g, "/"),
                fullPathOrig.replace(/\\/g, "/"),
                file.size, 'STEP', userId, body.groupId
            ).then(model_id =>
                res.json({model_id: model_id, filename: file.originalname, type: 'STEP', sizeKB: file.size})
            );
        } catch (err) {
            if (err) {
                console.error(err);
                res.status(500).send('Server failed!');
                return;
            }
        }
    })
};

exports.deleteModel = function (userId, modelId, res) {
    modelData.removeModel(modelId, userId).then(deleted => res.json({deleted}))
};