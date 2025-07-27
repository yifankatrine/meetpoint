import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Content.module.css';

interface City {
    cityId: number;
    name: string;
    description: string;
    address: string;
    openingTime: string;
    categories: string[];
    images: string[];
}

interface ApiResponse {
    success: boolean;
    cities?: City[];
    city?: City;
    message?: string;
}

const CitiesContent: React.FC = () => {
    const [cities, setCities] = useState<City[]>([]);
    const [newCity, setNewCity] = useState<Omit<City, 'cityId'>>({
        name: '',
        description: '',
        address: '',
        openingTime: '',
        categories: [],
        images: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Загрузка городов
    useEffect(() => {
        const fetchCities = async () => {
            try {
                setLoading(true);
                const response = await axios.get<ApiResponse>('http://localhost:5000/api/cities');

                if (response.data.success && response.data.cities) {
                    setCities(response.data.cities);
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

        fetchCities();
    }, []);

    // Создание нового города
    const handleCreateCity = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post<ApiResponse>('http://localhost:5000/api/cities', newCity);

            if (response.data.success) {
                if (response.data.city) {
                    setCities(prev => [...prev, response.data.city!]);
                } else if (response.data.cities) {
                    setCities(response.data.cities);
                }

                // Сброс формы
                setNewCity({
                    name: '',
                    description: '',
                    address: '',
                    openingTime: '',
                    categories: [],
                    images: []
                });
            } else {
                throw new Error(response.data.message || 'Не удалось создать город');
            }
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    };

    // Удаление города
    const handleDeleteCity = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.delete<ApiResponse>(`http://localhost:5000/api/cities/${id}`);

            if (response.data.success && response.data.cities) {
                setCities(response.data.cities);
            } else {
                throw new Error(response.data.message || 'Не удалось удалить город');
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
        setNewCity(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>Ошибка: {error}</div>;

    return (
        <div className={styles.container}>
            <h2>Управление городами</h2>

            <form onSubmit={handleCreateCity} className={styles.form}>
                <h3>Создать новый город</h3>
                <div className={styles.formGroup}>
                    <label>Название:</label>
                    <input
                        type="text"
                        name="name"
                        value={newCity.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Описание:</label>
                    <textarea
                        name="description"
                        value={newCity.description}
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
                        value={newCity.address}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    Создать город
                </button>
            </form>

            <div className={styles.list}>
                <h3>Список городов</h3>
                {cities.length === 0 ? (
                    <p>Нет городов</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Адрес</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cities.map(city => (
                            <tr key={city.cityId}>
                                <td>{city.cityId}</td>
                                <td>{city.name}</td>
                                <td>{city.description}</td>
                                <td>{city.address}</td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteCity(city.cityId)}
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

export default CitiesContent;