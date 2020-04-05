const express = require('express');
const multer = require('multer');
const accessCheck = require('../access-check');
const modelAnnotationData = require('../db/model-annotation');

const modelAnnotation = express.Router();
const upload = multer({storage: multer.memoryStorage()});

// Get all model annotations
modelAnnotation.get('/all/:id', accessCheck.tokenCheck, function (req, res) {
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res, file => {
        modelAnnotationData.getAnnotations(file.file_id).then(data => res.json(data));
    });
});

// Post new annotation
modelAnnotation.post('/new/:id', [accessCheck.tokenCheck, upload.single('annotation')], function (req, res) {
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res, file => {
        modelAnnotationData.addAnnotation(file.file_id, req.body['annotation-data'])
            .then(() => res.sendStatus(200));
    });
});

module.exports = modelAnnotation;
