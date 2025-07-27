import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Content.module.css';

interface Entertainment {
    entertainmentId: number;
    name: string;
    description: string;
    address: string;
    openingTime: string;
    categories: number[];
    images: string[];
}

interface ApiResponse {
    success: boolean;
    entertainments?: Entertainment[];
    entertainment?: Entertainment;
    message?: string;
}

const EntertainmentContent: React.FC = () => {
    const [entertainments, setEntertainments] = useState<Entertainment[]>([]);
    const [newEntertainment, setNewEntertainment] = useState<Omit<Entertainment, 'entertainmentId'>>({
        name: '',
        description: '',
        address: '',
        openingTime: '',
        categories: [],
        images: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Загрузка развлечений
    useEffect(() => {
        const fetchEntertainments = async () => {
            try {
                setLoading(true);
                const response = await axios.get<ApiResponse>('http://localhost:5000/api/entertainments');

                if (response.data.success && response.data.entertainments) {
                    setEntertainments(response.data.entertainments);
                } else {
                    throw new Error(response.data.message || 'Неверный формат данных');
                }
            } catch (err) {
                setError(axios.isAxiosError(err)
                    ? err.response?.data?.message || err.message
                    : 'Неизвестная ошибка');
            } finally {
                setLoading(false);
            }
        };

        fetchEntertainments();
    }, []);

    // Создание нового развлечения
    const handleCreateEntertainment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post<ApiResponse>(
                'http://localhost:5000/api/entertainments',
                newEntertainment
            );

            if (response.data.success) {
                if (response.data.entertainment) {
                    setEntertainments(prev => [...prev, response.data.entertainment!]);
                } else if (response.data.entertainments) {
                    setEntertainments(response.data.entertainments);
                }

                // Сброс формы
                setNewEntertainment({
                    name: '',
                    description: '',
                    address: '',
                    openingTime: '',
                    categories: [],
                    images: []
                });
            } else {
                throw new Error(response.data.message || 'Не удалось создать развлечение');
            }
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    };

    // Удаление развлечения
    const handleDeleteEntertainment = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.delete<ApiResponse>(
                `http://localhost:5000/api/entertainments/${id}`
            );

            if (response.data.success && response.data.entertainments) {
                setEntertainments(response.data.entertainments);
            } else {
                throw new Error(response.data.message || 'Не удалось удалить развлечение');
            }
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewEntertainment(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>Ошибка: {error}</div>;

    return (
        <div className={styles.container}>
            <h2>Управление развлечениями</h2>

            {/* Форма создания развлечения */}
            <form onSubmit={handleCreateEntertainment} className={styles.form}>
                <h3>Создать новое развлечение</h3>
                <div className={styles.formGroup}>
                    <label>Название:</label>
                    <input
                        type="text"
                        name="name"
                        value={newEntertainment.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Описание:</label>
                    <textarea
                        name="description"
                        value={newEntertainment.description}
                        onChange={handleInputChange}
                        required
                        className={styles.textarea}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Адрес:</label>
                    <input
                        type="text"
                        name="address"
                        value={newEntertainment.address}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Время работы:</label>
                    <input
                        type="text"
                        name="openingTime"
                        value={newEntertainment.openingTime}
                        onChange={handleInputChange}
                        placeholder="Пример: 10:00-22:00"
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    Создать развлечение
                </button>
            </form>

            {/* Список развлечений */}
            <div className={styles.list}>
                <h3>Список развлечений</h3>
                {entertainments.length === 0 ? (
                    <p>Нет развлечений</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Адрес</th>
                            <th>Время работы</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {entertainments.map(entertainment => (
                            <tr key={entertainment.entertainmentId}>
                                <td>{entertainment.entertainmentId}</td>
                                <td>{entertainment.name}</td>
                                <td>{entertainment.description}</td>
                                <td>{entertainment.address}</td>
                                <td>{entertainment.openingTime || '-'}</td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteEntertainment(entertainment.entertainmentId)}
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

export default EntertainmentContent;