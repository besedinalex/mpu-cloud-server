const isToolKitOn = process.argv[2] !== 'test';

const db = require('./db');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const secret = 'Hello World!';
const cors = require('cors');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
const generator = require('generate-password');
const path = require('path');
const fs = require('fs-extra');

let cad2gltf = {};
if (isToolKitOn)
    cad2gltf = require('./cad2gltf');
else
    console.log('Test Mode without C3D Toolkit has been started!');

app.use(cookieParser());
app.use(cors());
console.log(__dirname + '/xeogl');
app.use('/view', express.static(__dirname + '/xeogl'));

function currentDate() {
    const date = new Date();
    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}

const tokenRequired = function (req, res, next) {
    const token = req.query.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else if (Date.now() >= decoded.exp * 1000) {
                res.status(401).send('Unauthorized: Token expired');
            } else {
                req.user_id = decoded.id;
                next();
            }
        });
    }
};

app.get('/token', function (req, res) { // Получить токен на год
    db.signIn(req.query.email, req.query.password).then(data => {
        const payload = {id: data.user_id};
        const token = jwt.sign(payload, secret, {expiresIn: '365d'});
        let expiresAt = Date.now() + +365 * 24 * 60 * 60 * 1000;
        res.json({token, expiresAt: expiresAt});
    }).catch(err => res.status(401).send(err.message));
});

app.get('/user', tokenRequired, function (req, res) {
    db.getUser(req.user_id).then(data => res.json(data))
});

app.post('/user', function (req, res) { // Добавить пользователь
    db.signUp(req.query.firstName, req.query.lastName, req.query.email.toLowerCase(), req.query.password)
        .then(userId => {
            const payload = {id: userId};
            const token = jwt.sign(payload, secret, {expiresIn: '365d'});
            let expiresAt = Date.now() + +365 * 24 * 60 * 60 * 1000;
            res.json({token, expiresAt: expiresAt});
        })
});

app.get('/models-user', tokenRequired, function (req, res) {
    db.getUserModels(req.user_id).then(data => res.json(data));
});

app.get('/models-group', tokenRequired, function (req, res) {
    db.getGroupModels(req.query.groupId).then(data => res.json(data));
});

app.get('/groups', tokenRequired, function (req, res) {
    db.getGroups(req.user_id).then(data => res.json(data));
});

app.get('/group-users', tokenRequired, function (req, res) {
    db.getUsersByGroup(req.query.groupId).then(data => res.json(data))
});

app.post('/group-create', tokenRequired, function (req) {
    db.addGroup(req.query.title, req.query.description, req.query.image, req.user_id, currentDate())
        .then(res => db.addGroupUser(req.user_id, res, 'ADMIN', currentDate()));
});

app.post('/group-user', tokenRequired, function (req, resolve) {
    const groupId = req.query.groupId;
    db.getUserAccess(groupId, req.user_id).then(res => {
        if (res[0].access === 'ADMIN' || res[0].access === 'MODERATOR') {
            db.getIdByEmail(req.query.email.toLowerCase()).then(id => {
                db.getUsersByGroup(groupId).then(res => {
                    let userFound = false;
                    res.map(user => {
                        if (user.user_id === id[0].user_id) {
                            userFound = true;
                        }
                    });
                    if (!userFound) {
                        let access = req.query.access;
                        if (access === 'ADMIN') {
                            access = 'MODERATOR';
                        }
                        db.addGroupUser(id[0].user_id, groupId, access, currentDate());
                    } else {
                        resolve.send(false);
                    }
                });
            });
        } else {
            resolve.send(false);
        }
    });
});

app.delete('/group-user', tokenRequired, (req, resolve) => {
    const groupId = req.query.groupId;
    const userId = req.query.userId;
    db.getUserAccess(groupId, req.user_id).then(res => {
        switch (res[0].access) {
            case 'ADMIN':
                db.getUserAccess(groupId, userId).then(res => {
                    if (res[0].access !== 'ADMIN') {
                        db.removeUser(groupId, userId).then(deleted => resolve.json({deleted}));
                    }
                });
                break;
            case 'MODERATOR':
                db.getUserAccess(groupId, userId).then(res => {
                    if (res[0].access === 'USER') {
                        db.removeUser(groupId, userId).then(deleted => resolve.json({deleted}));
                    }
                });
                break;
            default:
                resolve.send(false);
                break;
        }
    });
});

app.get('/model/original/:id', tokenRequired, (req, res) => {
    db.getModels(req.user_id).then(models => {
        for (let model of models) {
            if (model.model_id == req.params.id && model.owner == req.user_id) {
                console.log(model.originalPath)
                res.download(model.originalPath, model.filename);
            }
        }
    })
})

app.delete('/model/:id', tokenRequired, (req, res) => {
    db.removeModel(req.params.id, req.user_id).then(deleted => {
        res.json({deleted});
    })
})

app.get('/model/:id', tokenRequired, (req, res) => {
    db.getUserModels(req.user_id).then(models => {
        for (let model of models) {
            if (model.model_id == req.params.id && model.owner == req.user_id) {
                console.log(model)
                let gltf = JSON.parse(fs.readFileSync(model.gltfPath));
                res.json({model: gltf})
            }
        }
    })
})

app.post('/models', [tokenRequired, upload.single('model')], (req, res) => {
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
                    sizeKB: req.file.size,
                    createdTime: currentDate()
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

app.set('view engine', 'ejs');

app.get('/view', tokenRequired, function (req, res) { // Вьювер для модели
    res.render(__dirname + '/view.ejs');
})

app.listen(4000, () => console.log('Сервер запущен!'));
