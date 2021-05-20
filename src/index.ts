// @ts-ignore
process.env.NODE_ENV = process.pkg ? 'production' : process.env.NODE_ENV;

// Server config validation starts here
try {
    require(process.cwd() + '/config.json');
} catch (e) {
    console.log('Файл config.json не обнаружен или содержит ошибки синтаксиса JSON:');
    console.log(e.message);
    process.exit(0);
}

const {
    DATA_PATH,
    CONVERTER_URL,
    RESET_PASSWORD_CODE_LENGTH,
    RESET_PASSWORD_EXPIRE,
    PASSWORD_ENCRYPT_SECURITY,
    PASSWORD_LENGTH_MIN,
    PASSWORD_LENGTH_MAX,
    SECRET,
    UPLOAD_LIMIT,
    PORT
} = require(process.cwd() + '/config.json');

let initErrorMessage = '';

initErrorMessage += DATA_PATH === undefined || typeof DATA_PATH !== 'string' || DATA_PATH === '' ?
    '\nDATA_PATH: Необходимо указать путь хранения файлов пользователей в формате \"C:/some/path\".' : '';

initErrorMessage += CONVERTER_URL === undefined || typeof CONVERTER_URL !== 'string' || CONVERTER_URL === '' ?
    '\nCONVERTER_URL: Необходимо указать IP-адрес конвертера в формате \"http://192.168.1.1:3000\".' : '';

initErrorMessage += RESET_PASSWORD_CODE_LENGTH === undefined || typeof RESET_PASSWORD_CODE_LENGTH !== 'number' || RESET_PASSWORD_CODE_LENGTH < 2 ?
    '\nRESET_PASSWORD_CODE_LENGTH: Необходимо указать минимальную длину кода восстановления пароля. Значение не может быть меньше 2.' : '';

initErrorMessage += RESET_PASSWORD_EXPIRE === undefined || typeof RESET_PASSWORD_EXPIRE !== 'number' || RESET_PASSWORD_EXPIRE < 2 ?
    '\nRESET_PASSWORD_EXPIRE: Необходимо указать минимальное время существования кода восстановления пароля в минутах. Значение не может быть меньше 2.' : '';

initErrorMessage += PASSWORD_ENCRYPT_SECURITY === undefined || typeof PASSWORD_ENCRYPT_SECURITY !== 'number' || PASSWORD_ENCRYPT_SECURITY < 5 ?
    '\nPASSWORD_ENCRYPT_SECURITY: Необходимо указать сложность шифровки пароля. Значение не может быть меньше 5.' : '';

initErrorMessage += PASSWORD_LENGTH_MIN === undefined || typeof PASSWORD_LENGTH_MIN !== 'number' || PASSWORD_LENGTH_MIN < 8 ?
    '\nPASSWORD_LENGTH_MIN: Необходимо указать минимальную длину пароля. Значение не может быть меньше 8.' : '';

initErrorMessage += PASSWORD_LENGTH_MAX === undefined || typeof PASSWORD_LENGTH_MAX !== 'number' || PASSWORD_LENGTH_MAX > 56 ?
    '\nPASSWORD_LENGTH_MAX: Необходимо указать максимальную длину пароля. Значение не может быть больше 56.' : '';

initErrorMessage += PASSWORD_LENGTH_MIN > PASSWORD_LENGTH_MAX ?
    '\nPASSWORD_LENGTH_MIN не может быть больше PASSWORD_LENGTH_MAX.\n' : '';

initErrorMessage += SECRET === undefined || typeof SECRET !== 'string' || SECRET === '' ?
    '\nSECRET: Необходимо указать код шифрования JWT-токена в формате \"Any text you want\".' : '';

initErrorMessage += UPLOAD_LIMIT === undefined || typeof UPLOAD_LIMIT !== 'number' || UPLOAD_LIMIT < 1 ?
    '\nUPLOAD_LIMIT: Необходимо указать максимальный размер загружаемого файла в МБ. Значение не может быть меньше 1.' : '';

initErrorMessage += PORT === undefined || typeof PORT !== 'number' || PORT < 1024 || PORT > 65535 ?
    '\nPORT: Необходимо указать порт для доступа к сайту. Значение не может быть меньше 1024 или больше 65535.' : '';

if (initErrorMessage != '') {
    console.log('Ошибка настройки config.json:' + initErrorMessage);
    process.exit(0);
}
// Server config validation ends here

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import users from "./routes/users";
import groups from "./routes/groups";
import modelAnnotations from "./routes/model-annotations";
import FileManager from "./utils/file-manager";

FileManager.createFolder('').catch(() => null);

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
