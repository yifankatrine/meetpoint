import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESTAURANTS_FILE = path.join(__dirname, '../../db/restaurant.data.json');

// Чтение ресторанов из файла
const readRestaurants = async () => {
    try {
        const data = await fs.readFile(RESTAURANTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(RESTAURANTS_FILE, '[]');
            return [];
        }
        throw error;
    }
};

// Запись ресторанов в файл
const saveRestaurants = async (restaurants) => {
    await fs.writeFile(RESTAURANTS_FILE, JSON.stringify(restaurants, null, 2));
};

export default class RestaurantController {
    // Создание ресторана
    static async create(req, res) {
        try {
            const restaurants = await readRestaurants();
            const restaurantData = req.body;

            // Генерация ID
            const newId = restaurants.length > 0
                ? Math.max(...restaurants.map(r => parseInt(r.restaurantId))) + 1
                : 1;

            const newRestaurant = {
                restaurantId: newId,
                name: restaurantData.name,
                description: restaurantData.description,
                address: restaurantData.address,
                openingTime: restaurantData.openingTime,
                categories: restaurantData.categories || [],
                images: restaurantData.images || [],
                createdAt: new Date().toISOString()
            };

            restaurants.push(newRestaurant);
            await saveRestaurants(restaurants);

            console.log('Создан новый ресторан:', newRestaurant);

            return res.status(201).json({
                success: true,
                message: "Ресторан успешно создан",
                restaurant: newRestaurant
            });
        } catch (error) {
            console.error('Ошибка при создании ресторана:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Получение всех ресторанов
    static async getAll(req, res) {
        try {
            const restaurants = await readRestaurants();
            return res.status(200).json({
                success: true,
                restaurants: restaurants
            });
        } catch (error) {
            console.error('Ошибка при получении ресторанов:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Получение ресторана по ID
    static async getById(req, res) {
        try {
            const restaurants = await readRestaurants();
            const restaurantId = parseInt(req.params.restaurantId);
            const restaurant = restaurants.find(r => r.restaurantId === restaurantId);

            if (!restaurant) {
                return res.status(404).json({
                    success: false,
                    message: 'Ресторан не найден'
                });
            }

            return res.status(200).json({
                success: true,
                restaurant: restaurant
            });
        } catch (error) {
            console.error('Ошибка при получении ресторана:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Обновление ресторана
    static async update(req, res) {
        try {
            const restaurants = await readRestaurants();
            const restaurantId = parseInt(req.params.restaurantId);
            const index = restaurants.findIndex(r => r.restaurantId === restaurantId);

            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Ресторан не найден'
                });
            }

            const updatedRestaurant = {
                ...restaurants[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };

            // Сохраняем пустые массивы, если поля не переданы
            if (!req.body.categories) updatedRestaurant.categories = restaurants[index].categories;
            if (!req.body.images) updatedRestaurant.images = restaurants[index].images;

            restaurants[index] = updatedRestaurant;
            await saveRestaurants(restaurants);

            console.log('Обновлен ресторан:', updatedRestaurant);

            return res.status(200).json({
                success: true,
                message: "Ресторан успешно обновлен",
                restaurant: updatedRestaurant
            });
        } catch (error) {
            console.error('Ошибка при обновлении ресторана:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Удаление ресторана
    static async delete(req, res) {
        try {
            const restaurants = await readRestaurants();
            const restaurantId = parseInt(req.params.restaurantId);
            const filteredRestaurants = restaurants.filter(r => r.restaurantId !== restaurantId);

            if (restaurants.length === filteredRestaurants.length) {
                return res.status(404).json({
                    success: false,
                    message: 'Ресторан не найден'
                });
            }

            await saveRestaurants(filteredRestaurants);
            return res.status(200).json({
                success: true,
                message: 'Ресторан успешно удален'
            });
        } catch (error) {
            console.error('Ошибка при удалении ресторана:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }
}