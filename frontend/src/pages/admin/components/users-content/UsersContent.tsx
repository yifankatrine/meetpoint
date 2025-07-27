import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Content.module.css';
import { User, UsersResponse, NewUser } from '@/types/user.types';

const UsersContent: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<NewUser>({
        firstName: '',
        secondName: '',
        phone: '',
        birth: '',
        login: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Загрузка пользователей
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get<UsersResponse>('http://localhost:5000/api/users');

                if (response.data.success && Array.isArray(response.data.users)) {
                    setUsers(response.data.users);
                } else {
                    throw new Error('Неверный формат данных');
                }
            } catch (err) {
                setError(axios.isAxiosError(err)
                    ? err.response?.data?.message || err.message
                    : err instanceof Error ? err.message : 'Неизвестная ошибка');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Создание нового пользователя
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post<{
                success: boolean;
                user?: User;  // Добавляем опциональное поле для нового пользователя
                users?: User[];  // Или возможно возвращается обновленный список
                message?: string;
            }>('http://localhost:5000/api/registration', newUser);

            if (response.data.success) {
                // Вариант 1: API возвращает созданного пользователя в поле user
                if (response.data.user) {
                    setUsers(prev => [...prev, response.data.user!]);
                }
                // Вариант 2: API возвращает полный обновленный список
                else if (Array.isArray(response.data.users)) {
                    setUsers(response.data.users);
                }
                // Вариант 3: Просто обновляем список через новый запрос
                else {
                    const usersResponse = await axios.get<UsersResponse>('http://localhost:5000/api/users');
                    setUsers(usersResponse.data.users);
                }

                setNewUser({
                    firstName: '',
                    secondName: '',
                    phone: '',
                    birth: '',
                    login: '',
                    password: ''
                });
            } else {
                throw new Error(response.data.message || 'Не удалось создать пользователя');
            }
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : err instanceof Error ? err.message : 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    };

    // Удаление пользователя
    const handleDeleteUser = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.delete<UsersResponse>(`http://localhost:5000/api/users/${id}`);

            if (response.data.success && Array.isArray(response.data.users)) {
                setUsers(response.data.users);
            } else {
                throw new Error('Неверный формат данных');
            }
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : err instanceof Error ? err.message : 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>Ошибка: {error}</div>;

    return (
        <div className={styles.container}>
            <h2>Управление пользователями</h2>

            {/* Форма создания пользователя */}
            <form onSubmit={handleCreateUser} className={styles.form}>
                <h3>Создать нового пользователя</h3>
                <div className={styles.formGroup}>
                    <label>Имя:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={newUser.firstName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Фамилия:</label>
                    <input
                        type="text"
                        name="secondName"
                        value={newUser.secondName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Телефон:</label>
                    <input
                        type="text"
                        name="phone"
                        value={newUser.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Дата рождения:</label>
                    <input
                        type="date"
                        name="birth"
                        value={newUser.birth}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Логин:</label>
                    <input
                        type="text"
                        name="login"
                        value={newUser.login}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Пароль:</label>
                    <input
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    Создать пользователя
                </button>
            </form>

            {/* Список пользователей */}
            <div className={styles.usersList}>
                <h3>Список пользователей</h3>
                {users.length === 0 ? (
                    <p>Нет пользователей</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Фамилия</th>
                            <th>Телефон</th>
                            <th>Дата рождения</th>
                            <th>Логин</th>
                            <th>Пароль</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstName}</td>
                                <td>{user.secondName}</td>
                                <td>{user.phone}</td>
                                <td>{new Date(user.birth).toLocaleDateString()}</td>
                                <td>{user.login}</td>
                                <td>{user.password}</td>

                                <td>
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className={styles.deleteButton}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UsersContent;