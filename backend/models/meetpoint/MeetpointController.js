import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEETPOINTS_FILE = path.join(__dirname, '../../db/meetpoint.data.json');

// Чтение точек встреч из файла
const readMeetpoints = async () => {
    try {
        const data = await fs.readFile(MEETPOINTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(MEETPOINTS_FILE, '[]');
            return [];
        }
        throw error;
    }
};

// Запись точек встреч в файл
const saveMeetpoints = async (meetpoints) => {
    await fs.writeFile(MEETPOINTS_FILE, JSON.stringify(meetpoints, null, 2));
};

export default class MeetpointController {
    // Создание точки встречи
    static async create(req, res) {
        try {
            const meetpoints = await readMeetpoints();
            const meetpointData = req.body;

            // Генерация ID
            const newId = meetpoints.length > 0
                ? Math.max(...meetpoints.map(m => parseInt(m.meetpointId))) + 1
                : 1;

            const newMeetpoint = {
                meetpointId: newId,
                title: meetpointData.title,
                description: meetpointData.description,
                address: meetpointData.address,
                date: meetpointData.date,
                time: meetpointData.time,
                images: meetpointData.images || [],
                eventHostId: meetpointData.eventHostId,
                maxMembers: meetpointData.maxMembers,
                membersId: meetpointData.membersId || [meetpointData.eventHostId], // Автоматически добавляем организатора
                createdAt: new Date().toISOString()
            };

            meetpoints.push(newMeetpoint);
            await saveMeetpoints(meetpoints);

            console.log('Создана новая точка встречи:', newMeetpoint);

            return res.status(201).json({
                success: true,
                message: "Точка встречи успешно создана",
                meetpoint: newMeetpoint
            });
        } catch (error) {
            console.error('Ошибка при создании точки встречи:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Получение всех точек встречи
    static async getAll(req, res) {
        try {
            const meetpoints = await readMeetpoints();
            return res.status(200).json({
                success: true,
                meetpoints: meetpoints
            });
        } catch (error) {
            console.error('Ошибка при получении точек встречи:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Получение точки встречи по ID
    static async getById(req, res) {
        try {
            const meetpoints = await readMeetpoints();
            const meetpointId = parseInt(req.params.meetpointId);
            const meetpoint = meetpoints.find(m => m.meetpointId === meetpointId);

            if (!meetpoint) {
                return res.status(404).json({
                    success: false,
                    message: 'Точка встречи не найдена'
                });
            }

            return res.status(200).json({
                success: true,
                meetpoint: meetpoint
            });
        } catch (error) {
            console.error('Ошибка при получении точки встречи:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Обновление точки встречи
    static async update(req, res) {
        try {
            const meetpoints = await readMeetpoints();
            const meetpointId = parseInt(req.params.meetpointId);
            const index = meetpoints.findIndex(m => m.meetpointId === meetpointId);

            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Точка встречи не найдена'
                });
            }

            const updatedMeetpoint = {
                ...meetpoints[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };

            // Сохраняем предыдущие значения необязательных полей, если они не переданы
            if (!req.body.images) updatedMeetpoint.images = meetpoints[index].images;
            if (!req.body.membersId) updatedMeetpoint.membersId = meetpoints[index].membersId;

            meetpoints[index] = updatedMeetpoint;
            await saveMeetpoints(meetpoints);

            console.log('Обновлена точка встречи:', updatedMeetpoint);

            return res.status(200).json({
                success: true,
                message: "Точка встречи успешно обновлена",
                meetpoint: updatedMeetpoint
            });
        } catch (error) {
            console.error('Ошибка при обновлении точки встречи:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Удаление точки встречи
    static async delete(req, res) {
        try {
            const meetpoints = await readMeetpoints();
            const meetpointId = parseInt(req.params.meetpointId);
            const filteredMeetpoints = meetpoints.filter(m => m.meetpointId !== meetpointId);

            if (meetpoints.length === filteredMeetpoints.length) {
                return res.status(404).json({
                    success: false,
                    message: 'Точка встречи не найдена'
                });
            }

            await saveMeetpoints(filteredMeetpoints);
            return res.status(200).json({
                success: true,
                message: 'Точка встречи успешно удалена',
                meetpoints: meetpoints
            });
        } catch (error) {
            console.error('Ошибка при удалении точки встречи:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Добавление участника к точке встречи
    static async addMember(req, res) {
        try {
            const meetpoints = await readMeetpoints();
            const meetpointId = parseInt(req.params.meetpointId);
            const memberId = parseInt(req.body.memberId);
            const meetpoint = meetpoints.find(m => m.meetpointId === meetpointId);

            if (!meetpoint) {
                return res.status(404).json({
                    success: false,
                    message: 'Точка встречи не найдена'
                });
            }

            if (meetpoint.membersId.includes(memberId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Пользователь уже является участником'
                });
            }

            if (meetpoint.membersId.length >= meetpoint.maxMembers) {
                return res.status(400).json({
                    success: false,
                    message: 'Достигнуто максимальное количество участников'
                });
            }

            meetpoint.membersId.push(memberId);
            meetpoint.updatedAt = new Date().toISOString();
            await saveMeetpoints(meetpoints);

            return res.status(200).json({
                success: true,
                message: 'Участник успешно добавлен',
                meetpoint: meetpoint
            });
        } catch (error) {
            console.error('Ошибка при добавлении участника:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }
}