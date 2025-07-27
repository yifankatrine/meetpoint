import React, { useEffect, useState } from 'react';
import axios from 'axios';
import classes from "./ProfilePage.module.css";
import { User, UserResponse } from "@/types/user.types";
import { TokenResponse } from "@/types/token.types";
import defaultPhoto from "../../assets/default-photo.jpg";

const ProfilePage = () => {
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Требуется регистрация');
                }

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Проверяем токен
                const tokenResponse = await api.post<TokenResponse>('/token');

                if (!tokenResponse.data.isValid) {
                    throw new Error('Недействительный токен');
                }

                const userId = tokenResponse.data.user.userId;

                // Получаем данные пользователя
                const userResponse = await api.get<UserResponse>(`/users/${userId}`);

                // Важно: данные пользователя находятся в поле user ответа
                setProfile(userResponse.data.user);

            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || err.message);
                } else {
                    setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

        return () => {
            delete api.defaults.headers.common['Authorization'];
        };
    }, []);

    if (loading) {
        return <div className={classes.page}>Загрузка...</div>;
    }

    if (error) {
        return <div className={classes.page}>Ошибка: {error}</div>;
    }

    if (!profile) {
        return <div className={classes.page}>Данные пользователя не найдены</div>;
    }

    return (
        <div className={classes.page}>
            <div className={classes.container}>
                <img src={defaultPhoto} alt="default-photo" width={204} height={254} />
                <div className={classes.id}>
                    ID: {profile.id || "Не указано"} 
                </div>
                <div className={classes.login}>
                    Логин: {profile.login || "Не указан"}
                </div>
                <div className={classes.firstName}>
                    Имя: {profile.firstName || "Не указано"}
                </div>
                <div className={classes.lastName}>
                    Фамилия: {profile.secondName || "Не указано"}
                </div>
                <div className={classes.phone}>
                    Телефон: {profile.phone || "Не указан"}
                </div>
                <div className={classes.birth}>
                    Дата рождения: {profile.birth || "Не указана"}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;