import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig.js';

export default class JwtUtils {
    static generateToken(payload) {
        return jwt.sign(
            payload,
            jwtConfig.secret,
            {
                expiresIn: jwtConfig.expiresIn,
                issuer: jwtConfig.issuer,
            }
        );
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, jwtConfig.secret);
        } catch (error) {
            throw new Error('Недействительный или просроченный токен');
        }
    }

    static decodeToken(token) {
        return jwt.decode(token);
    }
}

