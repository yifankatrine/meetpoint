import UserModel from './UserModel.js';

export default class UserController {
    static async create(req, res) {
        try {
            const { firstName, secondName, birth, phone, login, password, role = 'user' } = req.body;

            if (!firstName || !secondName || !birth || !phone || !login || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Все поля обязательны"
                });
            }

            const existingUser = await UserModel.findByLogin(login);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Пользователь с таким логином уже существует"
                });
            }

            // const hashPassword = await bcrypt.hash(password, 10);
            const hashPassword = password;

            const userData = {
                firstName,
                secondName,
                birth,
                phone,
                login,
                hashPassword,
                role
            };

            const newUser = await UserModel.create(userData);
            const { password: _, ...userWithoutPassword } = newUser;

            res.status(201).json({
                success: true,
                message: "Пользователь успешно создан",
                user: userWithoutPassword
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Произошла ошибка при создании пользователя"
            });
        }
    }

    static async getAll(req, res) {
        try {
            const users = await UserModel.getAll();
            res.json({ success: true, users });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Произошла ошибка при получении данных о всех пользователях"
            });
        }
    }

    static async getById(req, res) {
        try {
            const user = await UserModel.getById(parseInt(req.params.id));
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Пользователь не найден"
                });
            }
            res.json({ success: true, user });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Произошла ошибка при получении данных о пользователе"
            });
        }
    }

    static async update(req, res) {
        try {
            const updatedUser = await UserModel.update(
                parseInt(req.params.id),
                req.body
            );

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: "Пользователь не найден"
                });
            }

            res.json({
                success: true,
                message: "Данные успешно обновлены",
                user: updatedUser
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Произошла ошибка при обновлении данных пользователя"
            });
        }
    }

    static async delete(req, res) {
        try {
            const success = await UserModel.delete(parseInt(req.params.id));
            if (!success) {

                return res.status(404).json({
                    success: false,
                    message: "Пользователь не найден"

                });
            }
            const users = await UserModel.getAll();
            res.json({ success: true, message: "Пользователь успешно удален", users });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Произошла ошибка при удалении пользователя"
            });
        }
    }
}