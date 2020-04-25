const express = require('express');
const generator = require('generate-password');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');
const multer = require('multer');
const accessCheck = require('../utils/access-check');
const fileData = require('../db/file');
const modelAnnotationData = require('../db/model-annotation');

const files = express.Router();
const upload = multer({storage: multer.memoryStorage()});

const filesPath = path.join(process.cwd(), 'data/storage');

// Sends model to converter and await for converted one
function convertModel(token, modelPath, exportFormat, result) {
    request({
        method: 'POST',
        url: `http://195.133.144.86:4001/model?token=${token}&exportFormat=${exportFormat}`,
        headers: {'Content-Type': 'multipart/form-data'},
        formData: {'model': fs.createReadStream(modelPath)}
    }, function (err, response) {
        result(err, response);
    });
}

// Download file from server
files.get('/original/:id', accessCheck.tokenCheck, function (req, res) {
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res, file => {
        const format = req.query.format.toLowerCase();
        const filePath = path.join(filesPath, file.code, file.code + '.' + format);
        if (fs.existsSync(filePath)) {
            res.download(filePath, `${file.title}.${format}`);
        } else {
            const origPath = filePath.replace('.' + format, '.' + file.format);
            convertModel(req.query.token, origPath, req.query.format, (err, response) => {
                if (response === undefined || response.statusCode === 500 || err) {
                    res.status(500).send({message: 'Не удалось конвертировать модель'});
                } else {
                    const model = JSON.parse(response.body);
                    fs.writeFile(filePath, model.data, () => res.download(filePath, `${file.title}.${format}`));
                }
            });
        }
    });
});

// Uploading file to server
files.post('/original', [accessCheck.tokenCheck, upload.single('model')], function (req, res) {
    const {body, file} = req;

    if (!body || !file) {
        res.status(400).send({message: 'Файл и соответствующая информация не обнаружены.'});
        return;
    }

    const modelCode = generator.generate({length: 20, numbers: true});
    const folderPath = path.join(filesPath, modelCode);
    const fullPathOrig  =path.join(folderPath, modelCode + path.extname(file.originalname));
    fs.outputFileSync(fullPathOrig, file.buffer, {flag: 'wx'});

    // Checks if PDF. PDF is added as is. 3D models are converted.
    if (path.extname(file.originalname).split('.')[1].toLowerCase() === 'pdf') {
        fileData.addFile(
            body.title, body.desc, file.originalname, modelCode, file.size,
            path.extname(file.originalname).split('.')[1], req.user_id, body.groupId
        ).then(data => res.json(data));
    } else {
        convertModel(req.query.token, fullPathOrig, 'gltf', (err, response) => {
            if (response === undefined || response.statusCode === 500 || err) {
                fs.removeSync(folderPath);
                res.status(500).send({message: 'Не удалось конвертировать модель.'});
            } else {
                const model = JSON.parse(response.body);
                fs.outputFileSync(path.join(folderPath, modelCode + '.gltf'), model.data, {flag: 'wx'});
                fs.outputFileSync(path.join(folderPath, modelCode + '.png'), Buffer.from(model.thumbnail));

                fileData.addFile(
                    body.title, body.desc, file.originalname, modelCode, file.size,
                    path.extname(file.originalname).split('.')[1], req.user_id, body.groupId
                )
                    .then(data => res.json(data))
                    .catch(() => res.status(500).send({message: 'Не удалось добавить модель.'}));
            }
        });
    }
});

// Removing file from server
files.delete('/original/:id', accessCheck.tokenCheck, (req, res) => {
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res, file => {
        fs.removeSync(path.join(filesPath, file.code));
        modelAnnotationData.deleteAnnotations(file.file_id)
            .then(() => {
                fileData.removeFile(req.params.id, req.user_id)
                    .then(deleted => res.json({deleted}))
                    .catch(() => res.status(500).send({message: 'Не удалось удалить модель.'}))
            })
            .catch(() => res.status(500).send({message: 'Не удалось удалить модель и её аннотации.'}));
    });
});

// Accessing server file
files.get('/view/:id', accessCheck.tokenCheck, function (req, res) {
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res, file => {
        const format = req.query.format;
        const filePath = path.join(filesPath, file.code, file.code + '.' + format);
        if (format === 'gltf') {
            const gltf = JSON.parse(fs.readFileSync(filePath));
            res.json(gltf);
        } else {
            res.sendFile(filePath);
        }
    });
});

// Adding preview of file
files.post('/preview/:id', [accessCheck.tokenCheck, upload.single('canvasImage')], function (req, res) {
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res,file => {
        const previewPath = path.join(filesPath, file.code, file.code + '.jpg');
        fs.writeFile(previewPath, req.file.buffer, () => res.sendStatus(200));
    });
});

module.exports = files;
