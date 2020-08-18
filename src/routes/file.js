const express = require('express');
const generator = require('generate-password');
const fs = require('fs-extra');
const path = require('path');
const request = require('request');
const multer = require('multer');
const accessCheck = require('../utils/access-check');
const fileData = require('../db/file');
const modelAnnotationData = require('../db/model-annotation');
const {UPLOAD_LIMIT, CONVERTER_URL} = require(process.cwd() + '/config.json');

const files = express.Router();
const upload = multer({storage: multer.memoryStorage()});

const filesPath = path.join(process.cwd(), 'data/storage');

// Sends model to converter and await for converted one
function convertModel(modelPath, from, to, result) {
    request({
        method: 'POST',
        url: `${CONVERTER_URL}/model`,
        headers: {'Content-Type': 'multipart/form-data'},
        formData: {'file': fs.createReadStream(modelPath), 'from': from, 'to': to}
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
            const origPath = path.join(filesPath, file.code, file.code + '.' + file.type);
            convertModel(origPath, file.type, req.query.format, (err, response) => {
                if (response === undefined || response.statusCode === 500 || err) {
                    res.status(500).send({message: 'Не удалось конвертировать файл.'});
                } else {
                    const model = JSON.parse(response.body).output;
                    fs.writeFile(filePath, Buffer.from(model, 'base64'), () => res.download(filePath, `${file.title}.${format}`));
                }
            });
        }
    });
});

// Uploading file to server
files.post('/original', [accessCheck.tokenCheck, upload.single('model')], function (req, res) {
    const {body, file} = req;

    // Checks if there's no file at all
    if (!body || !file) {
        res.status(400).send({message: 'Файл и соответствующая информация не обнаружены.'});
        return;
    }

    // Checks file limit in Megabytes
    if (file.size / 1024 / 1024 > UPLOAD_LIMIT) {
        res.status(400).send({message: `Невозможно загрузить файл. Ограничение по размеру файла: ${UPLOAD_LIMIT}Мб.`});
        return;
    }

    // Creates folder for files
    const modelCode = generator.generate({length: 20, numbers: true});
    const folderPath = path.join(filesPath, modelCode);
    const fullPathOrig = path.join(folderPath, modelCode + path.extname(file.originalname));
    fs.outputFileSync(fullPathOrig, file.buffer, {flag: 'wx'});

    // Adds info to database
    fileData.addFile(
        body.title, body.desc, file.originalname, modelCode, file.size,
        path.extname(file.originalname).split('.')[1], req.user_id, body.groupId
    )
        .then(async fileId => {
            const extension = path.extname(file.originalname).slice(1).toLowerCase();
            const modelsToConvert = [
                'acis', 'sat', 'iges', 'igs', 'jt', 'x_t',
                'x_b', 'xmt_txt', 'xmt_bin', 'xmp_txt', 'xpm_bin',
                'stp', 'step', 'c3d'
            ];
            const convertable = modelsToConvert.includes(extension);

            if (convertable) {
                await fileData.updateStatus(fileId, 'pending');
            }

            res.send({message: 'Файл успешно сохранен.'});

            if (convertable) {
                convertModel(fullPathOrig, extension, 'glb', (err, response) => {
                    if (response === undefined || response.statusCode === 500 || err) {
                        fileData.updateStatus(fileId, 'error');
                    } else {
                        const data = JSON.parse(response.body);
                        fs.outputFileSync(path.join(folderPath, modelCode + '.glb'), Buffer.from(data.output, 'base64'), {flag: 'wx'});
                        fs.outputFileSync(path.join(folderPath, modelCode + '.png'), Buffer.from(data.thumbnail, 'base64'));
                        fileData.updateStatus(fileId, 'success');
                    }
                });
            }
        })
        .catch(() => res.status(500).send({message: 'Не удалось сохранить файл.'}));
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
        if (format.isUndefined) {
            res.status(400).send({message: 'Необходимо указать формат запрашиваемого файла.'});
        } else {
            const filePath = path.join(filesPath, file.code, file.code + '.' + format);
            if (fs.existsSync(filePath)) {
                if (format === 'gltf') {
                    const gltf = JSON.parse(fs.readFileSync(filePath));
                    res.send(gltf);
                } else {
                    res.sendFile(filePath);
                }
            } else {
                res.status(404).send({message: 'Запрашиваемый файл не найден.'});
            }
        }
    });
});

module.exports = files;
