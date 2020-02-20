const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const user = require('./requests/http/user');
const group = require('./requests/http/group');
const file = require('./requests/http/file');

const app = express();

app.use(cors());
app.use(cookieParser());

// Requests
app.use('/user', user);
app.use('/group', group);
app.use('/file', file);

// Public access files
app.use('/viewer', express.static(__dirname + '/embedded-viewer/public')); // 3D viewer
app.use('/', express.static(__dirname + '/public')); // React app

app.get('/*', (req, res) => res.sendFile(__dirname + '/public/index.html')); // React app

app.listen(4000, () => console.log('Сервер запущен!')); // TODO: Update port before prod
