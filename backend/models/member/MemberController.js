import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEMBERS_FILE = path.join(__dirname, '../../db/member.data.json');

// Вспомогательные функции для работы с файлом
const readMembers = async () => {
    try {
        const data = await fs.readFile(MEMBERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(MEMBERS_FILE, '[]');
            return [];
        }
        throw error;
    }
};

const saveMembers = async (members) => {
    await fs.writeFile(MEMBERS_FILE, JSON.stringify(members, null, 2));
};

export default class MemberController {
    // Создание нового участника
    static async create(req, res) {
        try {
            const members = await readMembers();
            const memberData = req.body;

            // Проверка обязательных полей
            const requiredFields = ['userId', 'meetpointId', 'name', 'phone'];
            const missingFields = requiredFields.filter(field => !memberData[field]);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Отсутствуют обязательные поля',
                    missingFields
                });
            }

            // Генерация ID
            const newId = members.length > 0
                ? Math.max(...members.map(m => m.id)) + 1
                : 1;

            const newMember = {
                id: newId,
                userId: memberData.userId,
                meetpointId: memberData.meetpointId,
                name: memberData.name,
                phone: memberData.phone,
                birth: memberData.birth || null,
                tg: memberData.tg || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            members.push(newMember);
            await saveMembers(members);

            console.log('Создан новый участник:', newMember);

            return res.status(201).json({
                success: true,
                message: "Участник успешно добавлен",
                member: newMember
            });
        } catch (error) {
            console.error('Ошибка при создании участника:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Получение всех участников
    static async getAll(req, res) {
        try {
            const members = await readMembers();
            return res.status(200).json({
                success: true,
                members: members
            });
        } catch (error) {
            console.error('Ошибка при получении участников:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Получение участника по ID
    static async getById(req, res) {
        try {
            const members = await readMembers();
            const memberId = parseInt(req.params.id);
            const member = members.find(m => m.id === memberId);

            if (!member) {
                return res.status(404).json({
                    success: false,
                    message: 'Участник не найден'
                });
            }

            return res.status(200).json({
                success: true,
                member: member
            });
        } catch (error) {
            console.error('Ошибка при получении участника:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Получение участников по meetpointId
    static async getByMeetpoint(req, res) {
        try {
            const members = await readMembers();
            const meetpointId = parseInt(req.params.meetpointId);
            const filteredMembers = members.filter(m => m.meetpointId === meetpointId);

            return res.status(200).json({
                success: true,
                members: filteredMembers
            });
        } catch (error) {
            console.error('Ошибка при получении участников:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Обновление участника
    static async update(req, res) {
        try {
            const members = await readMembers();
            const memberId = parseInt(req.params.id);
            const index = members.findIndex(m => m.id === memberId);

            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Участник не найден'
                });
            }

            const updatedMember = {
                ...members[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };

            // Сохраняем предыдущие значения необязательных полей, если они не переданы
            if (!req.body.birth) updatedMember.birth = members[index].birth;
            if (!req.body.tg) updatedMember.tg = members[index].tg;

            members[index] = updatedMember;
            await saveMembers(members);

            console.log('Обновлен участник:', updatedMember);

            return res.status(200).json({
                success: true,
                message: "Данные участника успешно обновлены",
                member: updatedMember
            });
        } catch (error) {
            console.error('Ошибка при обновлении участника:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }

    // Удаление участника
    static async delete(req, res) {
        try {
            const members = await readMembers();
            const memberId = parseInt(req.params.id);
            const filteredMembers = members.filter(m => m.id !== memberId);

            if (members.length === filteredMembers.length) {
                return res.status(404).json({
                    success: false,
                    message: 'Участник не найден'
                });
            }

            await saveMembers(filteredMembers);
            return res.status(200).json({
                success: true,
                message: 'Участник успешно удален'
            });
        } catch (error) {
            console.error('Ошибка при удалении участника:', error);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера'
            });
        }
    }
}