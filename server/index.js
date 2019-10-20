const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const generator = require('generate-password');
const path = require('path');
const fs = require('fs-extra');

const db = require('./db');
const user = require('./requests/user');
const group = require('./requests/group');

const isToolKitOn = process.argv[2] !== 'test';
let cad2gltf = {};
if (isToolKitOn) {
    cad2gltf = require('./cad2gltf');
} else {
    console.log('Test Mode without C3D Toolkit has been started!');
}

const upload = multer({storage: multer.memoryStorage()});

const app = express();

app.use(cors());
app.use(cookieParser());
app.use('/view', express.static(__dirname + '/xeogl'));

app.set('view engine', 'ejs');

app.listen(4000, () => console.log('Сервер запущен!'));

// Auth

app.get('/token', function (req, res) {
    user.signInUser(req.query.email, req.query.password, res);
});

app.post('/user', function (req, res) {
    user.signUpUser(req.query.firstName, req.query.lastName, req.query.email, req.query.password, res)
});

// Groups

app.get('/group', user.checkToken, function (req, res) {
    group.getGroup(req.user_id, req.query.groupId, res);
});

app.post('/group-create', user.checkToken, function (req) {
    group.createGroup(req.query.title, req.query.description, req.query.image, req.user_id);
});

app.get('/groups', user.checkToken, function (req, res) {
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

// Unsorted

app.get('/user', function (req, res) {
    db.getUser(req.query.userId).then(data => res.json(data))
});

app.get('/user-models', user.checkToken, function (req, res) {
    db.getUserModels(req.user_id).then(data => res.json(data));
});

app.get('/model/original/:id', user.checkToken, (req, res) => {
    db.getModels(req.user_id).then(models => {
        for (let model of models) {
            if (model.model_id == req.params.id && model.owner == req.user_id) {
                console.log(model.originalPath)
                res.download(model.originalPath, model.filename);
            }
        }
    })
})

app.delete('/model/:id', user.checkToken, (req, res) => {
    db.removeModel(req.params.id, req.user_id).then(deleted => {
        res.json({deleted});
    })
})

app.get('/model/:id', user.checkToken, (req, res) => {
    db.getUserModels(req.user_id).then(models => {
        for (let model of models) {
            if (model.model_id == req.params.id && model.ownerUser == req.user_id) {
                console.log(model)
                let gltf = JSON.parse(fs.readFileSync(model.gltfPath));
                res.json({model: gltf})
            }
        }
    })
})

app.post('/models', [user.checkToken, upload.single('model')], (req, res) => {
    if (!req.body || !req.file) {
        console.error('Bad Request. Fileds or files required!');
        res.status(500).send('Bad reqruest!');
        return;
    }

    console.log(req.file)

    let modelCode = generator.generate({length: 20, numbers: true});
    let cellPath = path.join(__dirname, 'storage', modelCode); // Путь к физической папке

    let fileNameOrig = modelCode + path.extname(req.file.originalname);
    let fullPathOrig = path.join(cellPath, fileNameOrig);

    let fileNameGLTF = modelCode + '.gltf'; // Название файла
    let fullPathGLTF = path.join(cellPath, fileNameGLTF);

    console.log(req.body, req.file, fullPathGLTF);

    cad2gltf(req.file.buffer, (gltf, err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Import error!');
            return;
        }

        let plainGLTF = JSON.stringify(gltf);

        try {
            fs.outputFileSync(fullPathGLTF, plainGLTF, {flag: 'wx'});
            fs.outputFileSync(fullPathOrig, req.file.buffer, {flag: 'wx'});

            db.addModel(
                req.body.title,
                req.body.desc,
                req.file.originalname,
                fullPathGLTF.replace(/\\/g, "/"),
                fullPathOrig.replace(/\\/g, "/"),
                req.file.size,
                'STEP',
                req.user_id,
                req.body.groupId
            ).then(model_id => {
                res.json({
                    model_id: model_id,
                    filename: req.file.originalname,
                    type: 'STEP',
                    sizeKB: req.file.size
                });
            })

        } catch (err) {
            if (err) {
                console.error(err);
                res.status(500).send('Server failed!');
                return;
            }
        }
    })
})

app.get('/view', user.checkToken, function (req, res) { // Вьювер для модели
    res.render(__dirname + '/view.ejs');
})
