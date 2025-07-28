import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RestaurantCard from '../../entities/restaurant/RestaurantCard';
import defaultImage from "../../assets/default.jpg";
import classes from "./RestaurantsList.module.css";

interface Restaurant {
    restaurantId: number;
    name: string;
    description: string;
    address: string;
    openingTime: string;
    categories: number[];
    images: string[];
}

interface ApiResponse {
    success: boolean;
    restaurants: Restaurant[];
}

const RestaurantsList = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get<ApiResponse>('http://31.129.58.91:5000/api/restaurants');

                if (response.data.success) {
                    setRestaurants(response.data.restaurants);
                } else {
                    throw new Error('Server returned success: false');
                }
            } catch (err) {
                setError(axios.isAxiosError(err)
                    ? err.message
                    : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    if (loading) {
        return <div className={classes.loading}>Загрузка ресторанов...</div>;
    }

    if (error) {
        return <div className={classes.error}>Ошибка: {error}</div>;
    }

    if (restaurants.length === 0) {
        return <div className={classes.empty}>Нет доступных ресторанов</div>;
    }

    return (
        <div className={classes.restaurantsGrid}>
            {restaurants.map(restaurant => (
                <RestaurantCard
                    key={restaurant.restaurantId}
                    image={defaultImage}
                    name={restaurant.name}
                    description={restaurant.description}
                    address={restaurant.address}
                />
            ))}
        </div>
    );
};

export default RestaurantsList;