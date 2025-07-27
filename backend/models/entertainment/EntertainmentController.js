import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENTERTAINMENTS_FILE = path.join(__dirname, '../../db/entertainment.data.json');

// Чтение развлечений из файла
const readEntertainments = async () => {
    try {
        const data = await fs.readFile(ENTERTAINMENTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(ENTERTAINMENTS_FILE, '[]');
            return [];
        }
        throw error;
    }
};

// Запись развлечений в файл
const saveEntertainments = async (entertainments) => {
    await fs.writeFile(ENTERTAINMENTS_FILE, JSON.stringify(entertainments, null, 2));
};

export default class EntertainmentController {
    // Создание развлечения
    static async create(req, res) {
        try {
            const entertainments = await readEntertainments();
            const data = req.body;

            const newId = entertainments.length > 0
                ? Math.max(...entertainments.map(e => parseInt(e.entertainmentId))) + 1
                : 1;

            const newEntertainment = {
                entertainmentId: newId,
                name: data.name,
                description: data.description,
                address: data.address,
                openingTime: data.openingTime,
                categories: data.categories || [],
                images: data.images || [],
                createdAt: new Date().toISOString()
            };

            entertainments.push(newEntertainment);
            await saveEntertainments(entertainments);

            console.log('Создано новое развлечение:', newEntertainment);

            return res.status(201).json({
                success: true,
                message: "Развлечение успешно создано",
                entertainment: newEntertainment
            });
        } catch (error) {
            console.error('Ошибка при создании развлечения:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Получение всех развлечений
    static async getAll(req, res) {
        try {
            const entertainments = await readEntertainments();
            return res.status(200).json({
                success: true,
                entertainments: entertainments
            });
        } catch (error) {
            console.error('Ошибка при получении развлечений:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Получение развлечения по ID
    static async getById(req, res) {
        try {
            const entertainments = await readEntertainments();
            const entertainmentId = parseInt(req.params.entertainmentId);
            const entertainment = entertainments.find(e => e.entertainmentId === entertainmentId);

            if (!entertainment) {
                return res.status(404).json({
                    success: false,
                    message: 'Развлечение не найдено'
                });
            }

            return res.status(200).json({
                success: true,
                entertainment: entertainment
            });
        } catch (error) {
            console.error('Ошибка при получении развлечения:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Обновление развлечения
    static async update(req, res) {
        try {
            const entertainments = await readEntertainments();
            const entertainmentId = parseInt(req.params.entertainmentId);
            const index = entertainments.findIndex(e => e.entertainmentId === entertainmentId);

            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Развлечение не найдено'
                });
            }

            const updatedEntertainment = {
                ...entertainments[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };

            if (!req.body.categories) updatedEntertainment.categories = entertainments[index].categories;
            if (!req.body.images) updatedEntertainment.images = entertainments[index].images;

            entertainments[index] = updatedEntertainment;
            await saveEntertainments(entertainments);

            console.log('Обновлено развлечение:', updatedEntertainment);

            return res.status(200).json({
                success: true,
                message: "Развлечение успешно обновлено",
                entertainment: updatedEntertainment
            });
        } catch (error) {
            console.error('Ошибка при обновлении развлечения:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Удаление развлечения
    static async delete(req, res) {
        try {
            const entertainments = await readEntertainments();
            const entertainmentId = parseInt(req.params.entertainmentId);
            const filtered = entertainments.filter(e => e.entertainmentId !== entertainmentId);

            if (entertainments.length === filtered.length) {
                return res.status(404).json({
                    success: false,
                    message: 'Развлечение не найдено'
                });
            }

            await saveEntertainments(filtered);
            return res.status(200).json({
                success: true,
                message: 'Развлечение успешно удалено'
            });
        } catch (error) {
            console.error('Ошибка при удалении развлечения:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Добавление категории к развлечению
    static async addCategory(req, res) {
        try {
            const entertainments = await readEntertainments();
            const entertainmentId = parseInt(req.params.entertainmentId);
            const categoryId = parseInt(req.body.categoryId);
            const entertainment = entertainments.find(e => e.entertainmentId === entertainmentId);

            if (!entertainment) {
                return res.status(404).json({
                    success: false,
                    message: 'Развлечение не найдено'
                });
            }

            if (entertainment.categories.includes(categoryId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Категория уже добавлена к развлечению'
                });
            }

            entertainment.categories.push(categoryId);
            entertainment.updatedAt = new Date().toISOString();
            await saveEntertainments(entertainments);

            return res.status(200).json({
                success: true,
                message: 'Категория успешно добавлена',
                entertainment: entertainment
            });
        } catch (error) {
            console.error('Ошибка при добавлении категории:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Добавление изображения к развлечению
    static async addImage(req, res) {
        try {
            const entertainments = await readEntertainments();
            const entertainmentId = parseInt(req.params.entertainmentId);
            const imageUrl = req.body.imageUrl;
            const entertainment = entertainments.find(e => e.entertainmentId === entertainmentId);

            if (!entertainment) {
                return res.status(404).json({
                    success: false,
                    message: 'Развлечение не найдено'
                });
            }

            entertainment.images.push(imageUrl);
            entertainment.updatedAt = new Date().toISOString();
            await saveEntertainments(entertainments);

            return res.status(200).json({
                success: true,
                message: 'Изображение успешно добавлено',
                entertainment: entertainment
            });
        } catch (error) {
            console.error('Ошибка при добавлении изображения:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }
}