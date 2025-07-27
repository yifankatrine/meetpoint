import JwtUtils from '../utils/jwtUtils.js';
import bcrypt from 'bcryptjs';
import UserModel from '../models/user/UserModel.js'; // Изменен импорт

class AuthController {
    async login(req, res) {
        try {
            const { login, password } = req.body;
            if (!login || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Логин и пароль обязательны'
                });
            }

            // 1. Находим пользователя через UserModel
            const user = await UserModel.findByLogin(login);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Неверный логин или пароль'
                });
            }

            // 2. Проверяем пароль (временная версия без хеширования)
            const isMatch = password === user.hashPassword;
            // Для production замените на:
            // const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Неверный логин или пароль'
                });
            }

            // 3. Генерируем JWT-токен
            const payload = {
                userId: user.id,
                role: user.role || 'user'
            };

            const token = JwtUtils.generateToken(payload);

            // 4. Формируем ответ без пароля
            const userData = {
                id: user.id,
                firstName: user.firstName,
                secondName: user.secondName,
                birth: user.birth,
                login: user.login,
                role: user.role,
                createdAt: user.createdAt
            };

            res.json({
                success: true,
                token,
                user: userData
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка сервера при авторизации',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

export default new AuthController();