import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Content.module.css';

interface Meetpoint {
    meetpointId: number;
    title: string;
    description: string;
    address: string;
    date: string;
    time: string;
    images: string[];
    eventHostId: number;
    maxMembers: number;
    membersId: number[];
}

interface ApiResponse {
    success: boolean;
    meetpoints?: Meetpoint[];
    meetpoint?: Meetpoint;
    message?: string;
}

const MeetpointsContent: React.FC = () => {
    const [meetpoints, setMeetpoints] = useState<Meetpoint[]>([]);
    const [newMeetpoint, setNewMeetpoint] = useState<Omit<Meetpoint, 'meetpointId'>>({
        title: '',
        description: '',
        address: '',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        images: [], // Пустой массив по умолчанию
        eventHostId: NaN,
        maxMembers: NaN,
        membersId: [] // Пустой массив по умолчанию
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Загрузка точек встреч
    useEffect(() => {
        const fetchMeetpoints = async () => {
            try {
                setLoading(true);
                const response = await axios.get<ApiResponse>('http://localhost:5000/api/meetpoints');

                if (response.data.success && response.data.meetpoints) {
                    setMeetpoints(response.data.meetpoints);
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

        fetchMeetpoints();
    }, []);

    // Создание новой точки встречи
    const handleCreateMeetpoint = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Формируем данные для отправки с пустыми массивами
            const postData = {
                ...newMeetpoint,
                images: [], // Явно передаем пустой массив
                membersId: [] // Явно передаем пустой массив
            };

            const response = await axios.post<ApiResponse>(
                'http://localhost:5000/api/meetpoints',
                postData
            );

            if (response.data.success) {
                if (response.data.meetpoint) {
                    setMeetpoints(prev => [...prev, response.data.meetpoint!]);
                } else if (response.data.meetpoints) {
                    setMeetpoints(response.data.meetpoints);
                }

                // Сброс формы с пустыми массивами
                setNewMeetpoint({
                    title: '',
                    description: '',
                    address: '',
                    date: new Date().toISOString().split('T')[0],
                    time: '19:00',
                    images: [],
                    eventHostId: 0,
                    maxMembers: 10,
                    membersId: []
                });
            } else {
                throw new Error(response.data.message || 'Не удалось создать точку встречи');
            }
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    };

    // Удаление точки встречи
    const handleDeleteMeetpoint = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.delete<ApiResponse>(
                `http://localhost:5000/api/meetpoints/${id}`
            );

            if (response.data.success && response.data.meetpoints) {
                setMeetpoints(response.data.meetpoints);
            } else {
                throw new Error(response.data.message || 'Не удалось удалить точку встречи');
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
        setNewMeetpoint(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewMeetpoint(prev => ({ ...prev, [name]: Number(value) }));
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>Ошибка: {error}</div>;

    return (
        <div className={styles.container}>
            <h2>Управление точками встреч</h2>

            {/* Форма создания точки встречи */}
            <form onSubmit={handleCreateMeetpoint} className={styles.form}>
                <h3>Создать новую точку встречи</h3>

                <div className={styles.formGroup}>
                    <label>Название:</label>
                    <input
                        type="text"
                        name="title"
                        value={newMeetpoint.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Описание:</label>
                    <textarea
                        name="description"
                        value={newMeetpoint.description}
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
                        value={newMeetpoint.address}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Дата:</label>
                        <input
                            type="date"
                            name="date"
                            value={newMeetpoint.date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Время:</label>
                        <input
                            type="time"
                            name="time"
                            value={newMeetpoint.time}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>ID организатора:</label>
                        <input
                            type="number"
                            name="eventHostId"
                            value={newMeetpoint.eventHostId}
                            onChange={handleNumberInputChange}
                            required
                            min="0"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Макс. участников:</label>
                        <input
                            type="number"
                            name="maxMembers"
                            value={newMeetpoint.maxMembers}
                            onChange={handleNumberInputChange}
                            required
                            min="1"
                        />
                    </div>
                </div>

                <button type="submit" className={styles.submitButton}>
                    Создать точку встречи
                </button>
            </form>

            {/* Список точек встреч */}
            <div className={styles.list}>
                <h3>Список точек встреч</h3>
                {meetpoints.length === 0 ? (
                    <p>Нет точек встреч</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Адрес</th>
                            <th>Дата</th>
                            <th>Время</th>
                            <th>Организатор</th>
                            <th>Участников</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {meetpoints.map(mp => (
                            <tr key={mp.meetpointId}>
                                <td>{mp.meetpointId}</td>
                                <td>{mp.title}</td>
                                <td>{mp.address}</td>
                                <td>{new Date(mp.date).toLocaleDateString()}</td>
                                <td>{mp.time}</td>
                                <td>{mp.eventHostId}</td>
                                <td>{mp.membersId.length}/{mp.maxMembers}</td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteMeetpoint(mp.meetpointId)}
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

export default MeetpointsContent;