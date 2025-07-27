import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Content.module.css';

interface Restaurant {
    restaurantId: number;
    name: string;
    description: string;
    address: string;
    openingTime: string;
    categories: string[];
    images: number[];
}

interface ApiResponse {
    success: boolean;
    restaurants?: Restaurant[];
    restaurant?: Restaurant;
    message?: string;
}

const RestaurantsContent: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [newRestaurant, setNewRestaurant] = useState<Omit<Restaurant, 'restaurantId'>>({
        name: '',
        description: '',
        address: '',
        openingTime: '',
        categories: [],
        images: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Загрузка ресторанов
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setLoading(true);
                const response = await axios.get<ApiResponse>('http://localhost:5000/api/restaurants');

                if (response.data.success && response.data.restaurants) {
                    setRestaurants(response.data.restaurants);
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

        fetchRestaurants();
    }, []);

    // Создание нового ресторана
    const handleCreateRestaurant = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post<ApiResponse>(
                'http://localhost:5000/api/restaurants',
                newRestaurant
            );

            if (response.data.success) {
                if (response.data.restaurant) {
                    setRestaurants(prev => [...prev, response.data.restaurant!]);
                } else if (response.data.restaurants) {
                    setRestaurants(response.data.restaurants);
                }

                // Сброс формы
                setNewRestaurant({
                    name: '',
                    description: '',
                    address: '',
                    openingTime: '',
                    categories: [],
                    images: []
                });
            } else {
                throw new Error(response.data.message || 'Не удалось создать ресторан');
            }
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    };

    // Удаление ресторана
    const handleDeleteRestaurant = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.delete<ApiResponse>(
                `http://localhost:5000/api/restaurants/${id}`
            );

            if (response.data.success && response.data.restaurants) {
                setRestaurants(response.data.restaurants);
            } else {
                throw new Error(response.data.message || 'Не удалось удалить ресторан');
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
        setNewRestaurant(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>Ошибка: {error}</div>;

    return (
        <div className={styles.container}>
            <h2>Управление ресторанами</h2>

            {/* Форма создания ресторана */}
            <form onSubmit={handleCreateRestaurant} className={styles.form}>
                <h3>Создать новый ресторан</h3>
                <div className={styles.formGroup}>
                    <label>Название:</label>
                    <input
                        type="text"
                        name="name"
                        value={newRestaurant.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Описание:</label>
                    <textarea
                        name="description"
                        value={newRestaurant.description}
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
                        value={newRestaurant.address}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Время работы:</label>
                    <input
                        type="text"
                        name="openingTime"
                        value={newRestaurant.openingTime}
                        onChange={handleInputChange}
                        placeholder="Пример: 10:00-22:00"
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    Создать ресторан
                </button>
            </form>

            {/* Список ресторанов */}
            <div className={styles.list}>
                <h3>Список ресторанов</h3>
                {restaurants.length === 0 ? (
                    <p>Нет ресторанов</p>
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
                        {restaurants.map(restaurant => (
                            <tr key={restaurant.restaurantId}>
                                <td>{restaurant.restaurantId}</td>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.description}</td>
                                <td>{restaurant.address}</td>
                                <td>{restaurant.openingTime || '-'}</td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteRestaurant(restaurant.restaurantId)}
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

export default RestaurantsContent;