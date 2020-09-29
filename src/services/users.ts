import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as userData from "../db/users";

const {SECRET} = require(process.cwd() + '/config.json');

export async function getUserToken(email: string, password: string, response: (code: number, json: object) => void) {
    try {
        const loginData = await userData.getUserLoginData(email);
        try {
            const passwordsMatch = await bcrypt.compare(password, loginData.password);
            if (!passwordsMatch) {
                response(401, {message: 'Неверный email или пароль.'});
            } else {
                const payload = {id: loginData.id, email: email};
                response(200, {token: jwt.sign(payload, SECRET, {expiresIn: '7d'})});
            }
        } catch {
            response(500, {message: 'Произошла ошибка при проверке пароля.'});
        }
    } catch {
        response(404, {message: 'Пользователь с таким email не найден.'});
    }
}
