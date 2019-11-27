const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const user = require('./requests/http/user');
const group = require('./requests/http/group');
const model = require('./requests/http/model');

const upload = multer({storage: multer.memoryStorage()});

const app = express();

app.use(cors());
app.use(cookieParser());
app.use('/viewer', express.static(__dirname + '/embedded-viewer/public'));
app.use('/preview', express.static(__dirname + '/storage/preview'));
app.use('/', express.static(__dirname + '/public'));

app.listen(4000, () => console.log('Сервер запущен!'));

// User data and Auth requests
app.get('/token', function (req, res) {
    user.signInUser(req.query.email, req.query.password, res);
});

app.get('/user', function (req, res) {
    user.getUserData(req.query.userId, res);
});

app.post('/user', function (req, res) {
    user.signUpUser(req.query.firstName, req.query.lastName, req.query.email, req.query.password, res)
});

app.get('/user-models', user.checkToken, function (req, res) {
    user.getUserModels(req.user_id, res);
});

// Groups requests

app.get('/user-group', user.checkToken, function (req, res) {
    group.getGroup(req.user_id, req.query.groupId, res);
});

app.post('/group-create', user.checkToken, function (req) {
    group.createGroup(req.query.title, req.query.description, req.query.image, req.user_id);
});

app.get('/user-groups', user.checkToken, function (req, res) {
    group.getGroups(req.user_id, res);
});

app.get('/group-models', user.checkToken, function (req, res) {
    group.getGroupModels(req.user_id, req.query.groupId, res);
});

app.get('/group-users', user.checkToken, function (req, res) {
    group.getGroupUsers(req.user_id, req.query.groupId, res);
});

app.post('/group-user', user.checkToken, function (req, res) {
    group.addUserToGroup(req.user_id, req.query.groupId, req.query.email, req.query.access, res);
});

app.delete('/group-user', user.checkToken, (req, res) => {
    group.removeUserFromGroup(req.user_id, req.query.groupId, req.query.userId, res);
});

// Models requests

app.get('/user-model/original/:id', user.checkToken, function (req, res) {
    model.downloadModel(req.user_id, req.query.groupId, req.query.format, req.query.token, __dirname, req.params.id, res);
});

app.get('/user-model/:id', user.checkToken, function (req, res) {
    model.getModel(req.user_id, req.query.groupId, req.params.id, res);
});

app.post('/user-model', [user.checkToken, upload.single('model')], function (req, res) {
    model.addModel(req.user_id, req.query.token, req.body, req.file, __dirname, res);
});

app.post('/user-model/preview/:id', [user.checkToken, upload.single('canvasImage')], function (req, res) {
    model.addModelPreview(req.user_id, req.query.groupId, req.params.id, req.file, __dirname, res);
});

app.delete('/user-model/:id', user.checkToken, (req, res) => {
    model.deleteModel(req.user_id, req.query.groupId, req.params.id, res);
});

// React app
app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
