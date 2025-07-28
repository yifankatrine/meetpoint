import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CityCard from '../../entities/city/CityCard'; // Предполагается существование компонента
import image from "../../assets/default.jpg";
import classes from "./CitiesList.module.css";

interface City {
    cityId: number;
    name: string;
    description: string;
    address: string;
    openingTime: number;
    categories: number[];
    images: string[];
}

interface ApiResponse {
    success: boolean;
    cities: City[];
}

const CitiesList = () => {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get<ApiResponse>('http://31.129.58.91:5000/api/cities');

                if (response.data.success) {
                    setCities(response.data.cities);
                } else {
                    throw new Error('Не удалось загрузить данные о городах');
                }
            } catch (err) {
                setError(axios.isAxiosError(err)
                    ? err.response?.data?.message || err.message
                    : 'Произошла неизвестная ошибка при загрузке городов');
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    if (loading) {
        return <div className={classes.loading}>Загрузка городов...</div>;
    }

    if (error) {
        return <div className={classes.error}>Ошибка: {error}</div>;
    }

    if (cities.length === 0) {
        return <div className={classes.empty}>Нет доступных городов</div>;
    }

    return (
        <div className={classes.gridContainer}>
            {cities.map(city => (
                <CityCard
                    key={city.cityId}
                    image={image}
                    name={city.name}
                    description={city.description}
                    address={city.address}
                />
            ))}
        </div>
    );
};

export default CitiesList;