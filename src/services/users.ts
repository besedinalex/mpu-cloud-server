import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from "crypto";
import readline from "readline";
import {validationResult} from "express-validator";
import UsersData from "../db/users";
import FileManager from "../utils/file-manager";
import {ServiceResponse} from "../types";

const {
    SECRET,
    RESET_PASSWORD_CODE_LENGTH,
    PASSWORD_ENCRYPT_SECURITY,
    RESET_PASSWORD_EXPIRE
} = require(process.cwd() + '/config.json');

type ResetRequest = {
    id?: number;
    valid?: boolean;
    email: string;
    token: string;
}

let passwordResetMode = false;
let lastPasswordResetId = 0;
const resetRequests: ResetRequest[] = [];

function addResetRequest(request: ResetRequest) {
    // Makes previous token invalid
    for (const obj of resetRequests) {
        // @ts-ignore
        if (obj.email === request.email && obj.valid) {
            // @ts-ignore
            obj.valid = false;
            break;
        }
    }
    // Adds new token
    request.id = lastPasswordResetId;
    request.valid = true;
    // @ts-ignore
    resetRequests.push(request);
    // Adds timer for added token
    const sequenceId = lastPasswordResetId;
    setTimeout(() => {
        for (const obj of resetRequests) {
            // @ts-ignore
            if (obj.id === sequenceId) {
                // @ts-ignore
                obj.valid = false;
                break;
            }
        }
    }, 1000 * 60 * RESET_PASSWORD_EXPIRE);
    // Update sequence
    lastPasswordResetId += 1;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', async input => {
    if (input === 'reset-password-mode') {
        passwordResetMode = !passwordResetMode;
        const message = passwordResetMode
            ? '\nВы вошли в режим восстановления паролей.\n'
            : '\nВы вышли из режима восстановления паролей.\n';
        console.log(message);
    } else {
        if (passwordResetMode) {
            const email = input.toLowerCase();
            try {
                const user = await UsersData.getUserDataByEmail(email);
                crypto.randomBytes(RESET_PASSWORD_CODE_LENGTH / 2, (err, buffer) => {
                    if (err) {
                        console.log('Не удалось сгенерировать код восстановления.');
                    } else {
                        const token = buffer.toString("hex");
                        const resetRequest = {token, email};
                        addResetRequest(resetRequest);
                        const message =
                            `Пользователь ${user.lastName} ${user.firstName} ` +
                            `ожидает следующий код восстановления:\n${token} ` +
                            `(Время действия: ${RESET_PASSWORD_EXPIRE} минут)`;
                        console.log(message);
                    }
                });
            } catch {
                console.log('Пользователь с таким email не найден.');
            }
        }
    }
});

export async function getUserToken(email: string, password: string, response: ServiceResponse) {
    try {
        const loginData = await UsersData.getUserLoginData(email);
        try {
            const passwordsMatch = await bcrypt.compare(password, loginData.password);
            if (!passwordsMatch) {
                response(401, {message: 'Неверный email или пароль.'});
            } else {
                const payload = {id: loginData.id, email};
                response(200, {token: jwt.sign(payload, SECRET, {expiresIn: '7d'})});
            }
        } catch {
            response(500, {message: 'Произошла ошибка при проверке пароля.'});
        }
    } catch {
        response(404, {message: 'Пользователь с таким email не найден.'});
    }
}

export async function createUser(email: string, password: string, firstName: string, lastName: string,
                                 response: ServiceResponse) {
    try {
        const hashedPassword = await bcrypt.hash(password, PASSWORD_ENCRYPT_SECURITY);
        try {
            const userId = await UsersData.addUser(firstName, lastName, email, hashedPassword);
            await FileManager.createFolder(`u${userId.toString()}`);
            const payload = {id: userId, email: email};
            response(201, {token: jwt.sign(payload, SECRET, {expiresIn: '7d'})});
        } catch {
            response(409, {message: 'Пользователь с таким email уже существует.'});
        }
    } catch {
        response(500, {message: 'Произошла ошибка при обработке паролей.'});
    }
}

export async function getUserData(id: number, response: ServiceResponse) {
    try {
        const user = await UsersData.getUserDataById(id);
        response(200, user);
    } catch {
        response(404, {message: 'Такой пользователь не найден.'});
    }
}

export async function updatePassword(token: string, password: string, response: ServiceResponse) {
    for (const request of resetRequests) {
        if (request.token === token) {
            if (!request.valid) {
                response(403, {message: 'Данный запрос на восстановление пароля не действителен.'});
            } else {
                try {
                    const loginData = await UsersData.getUserLoginData(request.email);
                    try {
                        const passwordsMatch = await bcrypt.compare(password, loginData.password);
                        if (passwordsMatch) {
                            response(403, {message: 'Нельзя использовать предыдущий пароль.'});
                        } else {
                            const req = {body: {password}};
                            const errors = validationResult(req);
                            if (!errors.isEmpty()) {
                                response(422, {message: errors.array()[0].msg});
                            } else {
                                try {
                                    const hashedPassword = await bcrypt.hash(password, PASSWORD_ENCRYPT_SECURITY);
                                    try {
                                        await UsersData.updatePassword(loginData.id, hashedPassword);
                                        request.valid = false;
                                        response(200, {message: 'Новый пароль установлен.'});
                                    } catch {
                                        response(500, {message: 'Не удалось изменить пароль.'});
                                    }
                                } catch {
                                    response(500, {message: 'Произошла ошибка при обработке паролей.'});
                                }
                            }
                        }
                    } catch {
                        response(500, {message: "Произошла ошибка при обработке паролей."});
                    }
                } catch {
                    response(404, {message: "Пользователь не найден."});
                }
            }
            return;
        }
    }
    response(404, {message: 'Такой запрос на восстановление пароля не найден.'});
}
