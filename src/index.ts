// @ts-ignore
process.env.NODE_ENV = process.pkg ? 'production' : process.env.NODE_ENV;

const {PORT, DATA_PATH} = require(process.cwd() + '/config.json');

if (DATA_PATH === undefined || DATA_PATH === '') {
    console.log('В config.json необходимо указать поле DATA_PATH с путем для хранения базы данных и файлов пользователей.');
    process.exit(0);
}

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import users from "./routes/users";
import groups from "./routes/groups";
import modelAnnotations from "./routes/model-annotations";
import FileManager from "./utils/file-manager";

if (!FileManager.pathExists('')) {
    FileManager.createFolder('');
}

const app = express();
const publicFolderPath = path.join(__dirname, '..', 'public');

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/', express.static(publicFolderPath));

app.use('/users', users);
app.use('/groups', groups);
app.use('/model-annotations', modelAnnotations);

app.get('/*', (req, res) => res.sendFile(path.join(publicFolderPath, 'index.html')));

app.listen(PORT, () => console.log(`Сервер запущен. Используемый порт: ${PORT}.`));
