import express from "express";
import jwtAuth from "../utils/jwt-auth";
const accessCheck = require('../utils/jwt-auth');
const modelAnnotationData = require('../db/model-annotations');

const modelAnnotations = express.Router();

// Get all model annotations
modelAnnotations.get('/all/:id', jwtAuth, (req, res) => {
    const {id} = req.params;
    // @ts-ignore
    const userId = req.user_id;
    const {groupId} = req.query;
    // @ts-ignore
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res, file => {
        modelAnnotationData.getAnnotations(file.file_id).then(data => res.json(data));
    });
});

// Post new annotation
modelAnnotations.post('/new/:id', jwtAuth, (req, res) => {
    // @ts-ignore
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res, file => {
        modelAnnotationData.addAnnotation(file.file_id, req.query.x, req.query.y, req.query.z, req.query.name, req.query.text)
            .then(() => res.sendStatus(200));
    });
});

// Delete annotation by id
modelAnnotations.delete('/one/:id', jwtAuth, (req, res) => {
    // @ts-ignore
    accessCheck.checkAccess(req.user_id, req.query.groupId, req.params.id, res, () => {
        modelAnnotationData.deleteAnnotation(req.query.annotationId).then(() => res.sendStatus(200));
    });
});

export default modelAnnotations;
