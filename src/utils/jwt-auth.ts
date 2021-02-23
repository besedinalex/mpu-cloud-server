import jwt from "jsonwebtoken";
import UsersData from "../db/repos/users";

const {SECRET} = require(process.cwd() + '/config.json');

// Checks if token is valid
export default function jwtAuth(req, res, next) {
    const {authorization} = req.headers;
    if (!authorization) {
        res.status(400).send({message: 'Данный запрос должен содержать Bearer токен.'});
        return;
    }
    const authData = authorization.split(' ');
    if (authData[0] !== 'Bearer') {
        res.status(400).send({message: 'Данный запрос должен содержать Bearer токен.'});
        return;
    }
    const token = authData[1];
    if (!token) {
        res.status(400).send({message: 'Данный запрос должен содержать Bearer токен.'});
    } else {
        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).send({message: 'Токен недействителен.'});
            } else if (Date.now() >= decoded.exp * 1000) {
                res.status(401).send({message: 'Токен истек. Необходимо перезайти в систему.'});
            } else {
                try {
                    const user = await UsersData.getUserDataById(decoded.id);
                    if (user.email !== decoded.email) {
                        res.status(401).send({message: 'Этот токен не принадлежит вам. Необходимо перезайти в систему.'});
                    } else {
                        req.user_id = decoded.id;
                        next();
                    }
                } catch {
                    res.status(401).send({message: 'Ваш токен недействителен. Необходимо перезайти в систему.'});
                }
            }
        });
    }
}
