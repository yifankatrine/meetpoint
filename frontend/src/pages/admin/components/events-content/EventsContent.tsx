import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Content.module.css';

interface Event {
    eventId: number;
    title: string;
    description: string;
    address: string;
    date: string;
    time: string;
    categories: string[];
    images: string[];
}

interface ApiResponse {
    success: boolean;
    events?: Event[];
    event?: Event;
    message?: string;
}

const EventsContent: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [newEvent, setNewEvent] = useState<Omit<Event, 'eventId'>>({
        title: '',
        description: '',
        address: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        categories: [],
        images: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Загрузка событий
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await axios.get<ApiResponse>('http://localhost:5000/api/events');

                if (response.data.success && response.data.events) {
                    setEvents(response.data.events);
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

        fetchEvents();
    }, []);

    // Создание нового события
    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post<ApiResponse>('http://localhost:5000/api/events', newEvent);

            if (response.data.success) {
                if (response.data.event) {
                    setEvents(prev => [...prev, response.data.event!]);
                } else if (response.data.events) {
                    setEvents(response.data.events);
                }

                // Сброс формы
                setNewEvent({
                    title: '',
                    description: '',
                    address: '',
                    date: new Date().toISOString().split('T')[0],
                    time: '',
                    categories: [],
                    images: []
                });
            } else {
                throw new Error(response.data.message || 'Не удалось создать событие');
            }
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    };

    // Удаление события
    const handleDeleteEvent = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.delete<ApiResponse>(`http://localhost:5000/api/events/${id}`);

            if (response.data.success && response.data.events) {
                setEvents(response.data.events);
            } else {
                throw new Error(response.data.message || 'Не удалось удалить событие');
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
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>Ошибка: {error}</div>;

    return (
        <div className={styles.container}>
            <h2>Управление событиями</h2>

            {/* Форма создания события */}
            <form onSubmit={handleCreateEvent} className={styles.form}>
                <h3>Создать новое событие</h3>
                <div className={styles.formGroup}>
                    <label>Название:</label>
                    <input
                        type="text"
                        name="title"
                        value={newEvent.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Описание:</label>
                    <textarea
                        name="description"
                        value={newEvent.description}
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
                        value={newEvent.address}
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
                            value={newEvent.date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Время:</label>
                        <input
                            type="time"
                            name="time"
                            value={newEvent.time}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <button type="submit" className={styles.submitButton}>
                    Создать событие
                </button>
            </form>

            {/* Список событий */}
            <div className={styles.list}>
                <h3>Список событий</h3>
                {events.length === 0 ? (
                    <p>Нет событий</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Адрес</th>
                            <th>Дата</th>
                            <th>Время</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {events.map(event => (
                            <tr key={event.eventId}>
                                <td>{event.eventId}</td>
                                <td>{event.title}</td>
                                <td>{event.description}</td>
                                <td>{event.address}</td>
                                <td>{new Date(event.date).toLocaleDateString()}</td>
                                <td>{event.time || '-'}</td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteEvent(event.eventId)}
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

export default EventsContent;