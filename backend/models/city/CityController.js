import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CITIES_FILE = path.join(__dirname, '../../db/city.data.json');

// Чтение городов из файла
const readCities = async () => {
    try {
        const data = await fs.readFile(CITIES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(CITIES_FILE, '[]');
            return [];
        }
        throw error;
    }
};

// Запись городов в файл
const saveCities = async (cities) => {
    await fs.writeFile(CITIES_FILE, JSON.stringify(cities, null, 2));
};

export default class CityController {
    // Создание города
    static async create(req, res) {
        try {
            const cities = await readCities();
            const data = req.body;

            const newId = cities.length > 0
                ? Math.max(...cities.map(c => parseInt(c.cityId))) + 1
                : 1;

            const newCity = {
                cityId: newId,
                name: data.name,
                description: data.description,
                address: data.address,
                openingTime: data.openingTime,
                categories: data.categories || [],
                images: data.images || [],
                createdAt: new Date().toISOString()
            };

            cities.push(newCity);
            await saveCities(cities);

            console.log('Создан новый город:', newCity);

            return res.status(201).json({
                success: true,
                message: "Город успешно создан",
                city: newCity
            });
        } catch (error) {
            console.error('Ошибка при создании города:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Получение всех городов
    static async getAll(req, res) {
        try {
            const cities = await readCities();
            return res.status(200).json({
                success: true,
                cities: cities
            });
        } catch (error) {
            console.error('Ошибка при получении городов:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Получение города по ID
    static async getById(req, res) {
        try {
            const cities = await readCities();
            const cityId = parseInt(req.params.cityId);
            const city = cities.find(c => c.cityId === cityId);

            if (!city) {
                return res.status(404).json({
                    success: false,
                    message: 'Город не найден'
                });
            }

            return res.status(200).json({
                success: true,
                city: city
            });
        } catch (error) {
            console.error('Ошибка при получении города:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Обновление города
    static async update(req, res) {
        try {
            const cities = await readCities();
            const cityId = parseInt(req.params.cityId);
            const index = cities.findIndex(c => c.cityId === cityId);

            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Город не найден'
                });
            }

            const updatedCity = {
                ...cities[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };

            if (!req.body.categories) updatedCity.categories = cities[index].categories;
            if (!req.body.images) updatedCity.images = cities[index].images;

            cities[index] = updatedCity;
            await saveCities(cities);

            console.log('Обновлен город:', updatedCity);

            return res.status(200).json({
                success: true,
                message: "Город успешно обновлен",
                city: updatedCity
            });
        } catch (error) {
            console.error('Ошибка при обновлении города:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Удаление города
    static async delete(req, res) {
        try {
            const cities = await readCities();
            const cityId = parseInt(req.params.cityId);
            const filtered = cities.filter(c => c.cityId !== cityId);

            if (cities.length === filtered.length) {
                return res.status(404).json({
                    success: false,
                    message: 'Город не найден'
                });
            }

            await saveCities(filtered);
            return res.status(200).json({
                success: true,
                message: 'Город успешно удален'
            });
        } catch (error) {
            console.error('Ошибка при удалении города:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Добавление категории к городу
    static async addCategory(req, res) {
        try {
            const cities = await readCities();
            const cityId = parseInt(req.params.cityId);
            const categoryId = parseInt(req.body.categoryId);
            const city = cities.find(c => c.cityId === cityId);

            if (!city) {
                return res.status(404).json({
                    success: false,
                    message: 'Город не найден'
                });
            }

            if (city.categories.includes(categoryId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Категория уже добавлена к городу'
                });
            }

            city.categories.push(categoryId);
            city.updatedAt = new Date().toISOString();
            await saveCities(cities);

            return res.status(200).json({
                success: true,
                message: 'Категория успешно добавлена',
                city: city
            });
        } catch (error) {
            console.error('Ошибка при добавлении категории к городу:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Добавление изображения к городу
    static async addImage(req, res) {
        try {
            const cities = await readCities();
            const cityId = parseInt(req.params.cityId);
            const imageUrl = req.body.imageUrl;
            const city = cities.find(c => c.cityId === cityId);

            if (!city) {
                return res.status(404).json({
                    success: false,
                    message: 'Город не найден'
                });
            }

            city.images.push(imageUrl);
            city.updatedAt = new Date().toISOString();
            await saveCities(cities);

            return res.status(200).json({
                success: true,
                message: 'Изображение успешно добавлено',
                city: city
            });
        } catch (error) {
            console.error('Ошибка при добавлении изображения к городу:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }
}