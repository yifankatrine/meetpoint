import JwtUtils from "../utils/jwtUtils.js";

export const authenticate = (req, res, next) => {
    // 1. Извлекаем токен из заголовка
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

    // 2. Если токена нет - ошибка 401
    if (!token) {
        return res.status(401).json({ message: 'Требуется авторизация' });
    }

    try {
        // 3. Проверяем токен (подпись + срок действия)
        const decoded = JwtUtils.verifyToken(token);

        // 4. Добавляем данные в запрос
        req.user = decoded; // { userId: 1, role: 'user' }
        next();
    } catch (error) {
        // 5. Если токен невалиден
        res.status(401).json({ message: 'Недействительный токен' });
    }
};