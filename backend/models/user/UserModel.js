import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

// Получаем текущий путь к директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к файлу с данными пользователей
const USERS_FILE = path.join(__dirname, '../../db/user.data.json');

export default class UserModel {
    static async #readData() {
        try {
            const data = await fs.readFile(USERS_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(USERS_FILE, '[]');
                return [];
            }
            throw error;
        }
    }

    static async #saveData(users) {
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    }

    static async getAll() {
        return await this.#readData();
    }

    static async getById(id) {
        const users = await this.#readData();
        return users.find(u => u.id === id);
    }

    static async findByLogin(login) {
        const users = await this.#readData();
        return users.find(u => u.login === login);
    }

    static async create(userData) {
        const users = await this.#readData();
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

        const newUser = {
            id: newId,
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        users.push(newUser);
        await this.#saveData(users);
        return newUser;
    }

    static async update(id, updateData) {
        const users = await this.#readData();
        const index = users.findIndex(u => u.id === id);

        if (index === -1) return null;

        const updatedUser = {
            ...users[index],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        users[index] = updatedUser;
        await this.#saveData(users);
        return updatedUser;
    }

    static async delete(id) {
        const users = await this.#readData();
        const filteredUsers = users.filter(u => u.id !== id);

        if (users.length === filteredUsers.length) return false;

        await this.#saveData(filteredUsers);
        return true;
    }
}