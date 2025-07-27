import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EVENTS_FILE = path.join(__dirname, '../../db/event.data.json');

// Чтение событий из файла
const readEvents = async () => {
    try {
        const data = await fs.readFile(EVENTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(EVENTS_FILE, '[]');
            return [];
        }
        throw error;
    }
};

// Запись событий в файл
const saveEvents = async (events) => {
    await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2));
};

export default class EventController {
    // Создание события
    static async create(req, res) {
        try {
            const events = await readEvents();
            const eventData = req.body;

            // Генерация ID
            const newId = events.length > 0
                ? Math.max(...events.map(e => parseInt(e.eventId))) + 1
                : 1;

            const newEvent = {
                eventId: newId,
                title: eventData.title,
                description: eventData.description,
                address: eventData.address,
                date: eventData.date,
                time: eventData.time,
                categories: eventData.categories || [],
                images: eventData.images || [],
                createdAt: new Date().toISOString()
            };

            events.push(newEvent);
            await saveEvents(events);

            console.log('Создано новое событие:', newEvent);

            return res.status(201).json({
                success: true,
                message: "Событие успешно создано",
                event: newEvent
            });
        } catch (error) {
            console.error('Ошибка при создании события:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Получение всех событий
    static async getAll(req, res) {
        try {
            const events = await readEvents();
            return res.status(200).json({
                success: true,
                events: events
            });
        } catch (error) {
            console.error('Ошибка при получении событий:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Получение события по ID
    static async getById(req, res) {
        try {
            const events = await readEvents();
            const eventId = parseInt(req.params.eventId);
            const event = events.find(e => e.eventId === eventId);

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Событие не найдено'
                });
            }

            return res.status(200).json({
                success: true,
                event: event
            });
        } catch (error) {
            console.error('Ошибка при получении события:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Обновление события
    static async update(req, res) {
        try {
            const events = await readEvents();
            const eventId = parseInt(req.params.eventId);
            const index = events.findIndex(e => e.eventId === eventId);

            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Событие не найдено'
                });
            }

            const updatedEvent = {
                ...events[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };

            // Сохраняем предыдущие значения необязательных полей, если они не переданы
            if (!req.body.categories) updatedEvent.categories = events[index].categories;
            if (!req.body.images) updatedEvent.images = events[index].images;

            events[index] = updatedEvent;
            await saveEvents(events);

            console.log('Обновлено событие:', updatedEvent);

            return res.status(200).json({
                success: true,
                message: "Событие успешно обновлено",
                event: updatedEvent
            });
        } catch (error) {
            console.error('Ошибка при обновлении события:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Удаление события
    static async delete(req, res) {
        try {
            const events = await readEvents();
            const eventId = parseInt(req.params.eventId);
            const filteredEvents = events.filter(e => e.eventId !== eventId);

            if (events.length === filteredEvents.length) {
                return res.status(404).json({
                    success: false,
                    message: 'Событие не найдено'
                });
            }

            await saveEvents(filteredEvents);
            return res.status(200).json({
                success: true,
                message: 'Событие успешно удалено'
            });
        } catch (error) {
            console.error('Ошибка при удалении события:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Добавление категории к событию
    static async addCategory(req, res) {
        try {
            const events = await readEvents();
            const eventId = parseInt(req.params.eventId);
            const categoryId = parseInt(req.body.categoryId);
            const event = events.find(e => e.eventId === eventId);

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Событие не найдено'
                });
            }

            if (event.categories.includes(categoryId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Категория уже добавлена к событию'
                });
            }

            event.categories.push(categoryId);
            event.updatedAt = new Date().toISOString();
            await saveEvents(events);

            return res.status(200).json({
                success: true,
                message: 'Категория успешно добавлена',
                event: event
            });
        } catch (error) {
            console.error('Ошибка при добавлении категории:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Добавление изображения к событию
    static async addImage(req, res) {
        try {
            const events = await readEvents();
            const eventId = parseInt(req.params.eventId);
            const imageUrl = req.body.imageUrl;
            const event = events.find(e => e.eventId === eventId);

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Событие не найдено'
                });
            }

            event.images.push(imageUrl);
            event.updatedAt = new Date().toISOString();
            await saveEvents(events);

            return res.status(200).json({
                success: true,
                message: 'Изображение успешно добавлено',
                event: event
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