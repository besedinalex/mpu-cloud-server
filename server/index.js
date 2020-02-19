const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const user = require('./requests/http/user');
const group = require('./requests/http/group');
const model = require('./requests/http/model');

const app = express();

app.use(cors());
app.use(cookieParser());

// Requests
app.use('/user', user);
app.use('/group', group);
app.use('/model', model);

// Files
app.use('/viewer', express.static(__dirname + '/embedded-viewer/public')); // Models
app.use('/preview', express.static(__dirname + '/storage/preview')); // Model previews
app.use('/', express.static(__dirname + '/public')); // React app

app.get('/*', (req, res) => res.sendFile(__dirname + '/public/index.html')); // React app

app.listen(4000, () => console.log('Сервер запущен!')); // TODO: Update port before prod
