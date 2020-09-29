// @ts-ignore
const express = require('express');
// @ts-ignore
const accessCheck = require('../utils/access-check');
const modelAnnotationData = require('../db/model-annotations');

const modelAnnotations = express.Router();

// Get all model annotations
modelAnnotations.get('/all/:id', accessCheck.jwtAuth, (req, res) => {
    const {id} = req.params;
    const userId = req.user_id;
    const {groupId} = req.query;
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res, file => {
        modelAnnotationData.getAnnotations(file.file_id).then(data => res.json(data));
    });
});

// Post new annotation
modelAnnotations.post('/new/:id', accessCheck.jwtAuth, (req, res) => {
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res, file => {
        modelAnnotationData.addAnnotation(file.file_id, req.query.x, req.query.y, req.query.z, req.query.name, req.query.text)
            .then(() => res.sendStatus(200));
    });
});

// Delete annotation by id
modelAnnotations.delete('/one/:id', accessCheck.jwtAuth, (req, res) => {
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res, () => {
        modelAnnotationData.deleteAnnotation(req.query.annotationId).then(() => res.sendStatus(200));
    });
});

export default modelAnnotations;
