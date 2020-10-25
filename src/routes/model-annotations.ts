import express from "express";
import jwtAuth from "../utils/jwt-auth";
import { addModelAnnotation, deleteModelAnnotation, getModelAnnotations } from "../services/files";

const modelAnnotations = express.Router();

modelAnnotations.get('/all', jwtAuth, async (req, res) => {
    const {path, groupId} = req.query;
    const id = groupId === undefined ? undefined : +groupId!;
    await getModelAnnotations(req['user_id'], id, path as string,
        (code, data) => res.status(code).send(data));
});

modelAnnotations.post('/new', jwtAuth, async (req, res) => {
    const {path, x, y, z, name, text, groupId} = req.body;
    await addModelAnnotation(req['user_id'], groupId, path, x, y, z, name, text,
        (code, data) => res.status(code).send(data));
});

modelAnnotations.delete('/one', jwtAuth, async (req, res) => {
    const {path, x, y, z, groupId} = req.query;
    const id = groupId === undefined ? undefined : +groupId!;
    const xA = x === undefined ? undefined : +x;
    const yA = y === undefined ? undefined : +y;
    const zA = z === undefined ? undefined : +z;
    await deleteModelAnnotation(req['user_id'], id, path as string, xA, yA, zA,
        (code, data) => res.status(code).send(data));
});

export default modelAnnotations;
