import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EntertainmentCard from '../../entities/entertainment/EntertainmentCard';
import image from "../../assets/default.jpg";
import classes from "./EntertainmentList.module.css";

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
    entertainments: Entertainment[];
}

const EntertainmentList = () => {
    const [entertainments, setEntertainments] = useState<Entertainment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEntertainments = async () => {
            try {
                const response = await axios.get<ApiResponse>('http://localhost:5000/api/entertainments');

                if (response.data.success) {
                    setEntertainments(response.data.entertainments); // Изменено с data на entertainments
                } else {
                    throw new Error('Не удалось загрузить данные');
                }
            } catch (err) {
                setError(axios.isAxiosError(err)
                    ? err.response?.data?.message || err.message
                    : 'Произошла неизвестная ошибка');
            } finally {
                setLoading(false);
            }
        };

        fetchEntertainments();
    }, []);

    if (loading) {
        return <div className={classes.loading}>Загрузка развлечений...</div>;
    }

    if (error) {
        return <div className={classes.error}>Ошибка: {error}</div>;
    }

    if (entertainments.length === 0) {
        return <div className={classes.empty}>Нет доступных развлечений</div>;
    }

    return (
        <div className={classes.gridContainer}>
            {entertainments.map(entertainment => (
                <EntertainmentCard
                    key={entertainment.entertainmentId}
                    image={entertainment.images?.[0] || image}
                    name={entertainment.name}
                    description={entertainment.description}
                    address={entertainment.address}
                />
            ))}
        </div>
    );
};

export default EntertainmentList;