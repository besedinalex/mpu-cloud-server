const express = require('express');
const accessCheck = require('../utils/access-check');
const modelAnnotationData = require('../db/model-annotation');

const modelAnnotation = express.Router();

// Get all model annotations
modelAnnotation.get('/all/:id', accessCheck.tokenCheck, function (req, res) {
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res, file => {
        modelAnnotationData.getAnnotations(file.file_id).then(data => res.json(data));
    });
});

// Post new annotation
modelAnnotation.post('/new/:id', accessCheck.tokenCheck, function (req, res) {
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res, file => {
        modelAnnotationData.addAnnotation(file.file_id, req.query.x, req.query.y, req.query.z, req.query.name, req.query.text)
            .then(() => res.sendStatus(200));
    });
});

// Delete annotation by id
modelAnnotation.delete('/one/:id', accessCheck.tokenCheck, function (req, res) {
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res, () => {
        modelAnnotationData.deleteAnnotation(req.query.annotationId).then(() => res.sendStatus(200));
    });
});

module.exports = modelAnnotation;
