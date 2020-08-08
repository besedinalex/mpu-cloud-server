const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const user = require('./routes/user');
const group = require('./routes/group');
const file = require('./routes/file');
const modelAnnotation = require('./routes/model-annotation');
const {PORT} = require(process.cwd() + '/config.json');

const app = express();
const publicFolderPath = path.join(__dirname, '..', 'public');

// Some security stuff
app.use(cors());
app.use(cookieParser());

// Public access files
app.use('/', express.static(publicFolderPath));

// Requests
app.use('/user', user);
app.use('/group', group);
app.use('/file', file);
app.use('/model-annotation', modelAnnotation);
app.get('/*', (req, res) => res.sendFile(path.join(publicFolderPath, 'index.html'))); // React app

app.listen(PORT, () => console.log(`Сервер запущен. Используемые порт: ${PORT}.`));
