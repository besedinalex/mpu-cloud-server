const db = require('./db');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const secret = 'Hello World!';
var cors = require('cors')
var multer = require('multer')
var upload = multer({ storage: multer.memoryStorage() })
const generator = require('generate-password');

app.use(cookieParser())
app.use(cors())

db.connect();

var authRequired = function (req, res, next) { // tokenRequired!!
    const token = req.query.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function (err, decoded) {
            console.log(decoded)
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

app.get('/token', function (req, res) {
    console.log(req.query);
    db.getUser(req.query.email, req.query.password).then(data => {
        const payload = { id: data.id_user };
        const token = jwt.sign(payload, secret, { expiresIn: '365d' });
        let expiresAt = Date.now() + + 365 * 24 * 60 * 60 * 1000;
        res.json({ token, expiresAt: expiresAt });
    }).catch(err => res.status(401).send(err.message));
});

app.post('/user', function (req, res) {
    console.log(req.query);
    db.addUser(req.query.firstName, req.query.lastName, req.query.email, req.query.password).then(userId => {
        const payload = { id: userId };
        const token = jwt.sign(payload, secret, { expiresIn: '365d' });
        let expiresAt = Date.now() + + 365 * 24 * 60 * 60 * 1000;
        res.json({ token, expiresAt: expiresAt });
    })
})

app.get('/models', authRequired, function (req, res) {
    db.getModels(req.user_id).then(data => {
        res.json(data);
    })
})

app.post('/models', [authRequired, upload.single('model')], (req, res) => {
    if (!req.body || !req.file) {
        console.error('Bad Request. Fileds or files required!');
        res.status(500).send('Bad request!');
        return;
    }

    let modelCode = generator.generate({ length: 20, numbers: true });
    let cellPath = path.join(__dirname, 'storage', modelCode); // Путь к физической папке

    let fileNameOrig = modelCode + path.extname(req.file.originalname);
    let fullPathOrig = path.join(cellPath, fileNameOrig);

    let fileNameGLTF = modelCode + '.gltf'; // Название файла
    let fullPathGLTF = path.join(cellPath, fileNameGLTF);

    cad2gltf(req.file.buffer, (gltf, err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Import error!');
            return;
        }

        let plainGLTF = JSON.stringify(gltf);

        try {
            fs.outputFileSync(fullPathGLTF, plainGLTF, { flag: 'wx' });
            fs.outputFileSync(fullPathOrig, req.file.buffer, { flag: 'wx' });

            db.addModel(req.query.title, req.query.desc, fullPathGLTF, req.user_id).then(model_id => {
                res.json({ model_id });
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


app.listen(4000, () => console.log('Сервер запущен!'));