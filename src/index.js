const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const user = require('./requests/http/user');
const group = require('./requests/http/group');
const file = require('./requests/http/file');
const modelAnnotation = require('./requests/http/model-annotation');

const app = express();
const publicFolderPath = path.join(__dirname.replace('src', ''), 'public');

// Some security stuff
app.use(cors());
app.use(cookieParser());

// Public access files
app.use('/', express.static(publicFolderPath));
app.use('/viewer', express.static(publicFolderPath + '/embedded-viewer')); // TODO: Remove on new React-viewer

// Requests
app.use('/user', user);
app.use('/group', group);
app.use('/file', file);
app.use('/model-annotation', modelAnnotation);
app.get('/*', (req, res) => res.sendFile(publicFolderPath)); // React app

app.listen(4000, () => console.log('Сервер запущен!')); // TODO: Update before prod
