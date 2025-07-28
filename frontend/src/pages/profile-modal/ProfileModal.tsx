import React, {useEffect, useState} from 'react';
import classes from "./ProfileModal.module.css";
import {Link} from "react-router-dom";
import axios from 'axios';
import { User, UserResponse } from "@/types/user.types";
import { TokenResponse } from "@/types/token.types";

import crown from '../../assets/crown.svg'
import bell from '../../assets/bell.svg'
import like from '../../assets/like.svg'
import location from '../../assets/location.svg'
import image from '../../assets/image.jpg'


const ProfileModal = () => {
    const [countEvent, setCountEvent] = useState(23)
    const [countPlaces, setCountPlaces] = useState(12)
    const [countCities, setCountCities] = useState(4)
    const [name, setName] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const api = axios.create({
        baseURL: 'http://31.129.58.91:5000/api',
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
                setName(userResponse.data.user);

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

    return (
        <div className={classes.profile}>
            <div className={classes.window}>
                <div className={classes.block}>
                    <div className={classes.container1}>
                        <img
                            className={classes.crown}
                            src={crown}
                            alt="crown"
                            width={48}
                            height={48}
                        />
                        <img
                            className={classes.image}
                            src={image}
                            alt="image"
                            width={180}
                            height={180}
                        />
                        <div className={classes.container2}>
                            <div className={classes.name}>
                                {name?.firstName || "Инкогнито"}
                            </div>
                            <div className={classes.subscribes}>
                                <div className={classes.subscribe}>
                                    ПОДПИСКА
                                </div>
                                <div className={classes.subscribeActive}>
                                    PRO
                                </div>
                            </div>
                            <div className={classes.textStatus}>
                                СТАТУС:
                            </div>
                            <div className={classes.status}>
                                ИМПЕРАТОР ТУСОВОК
                            </div>
                        </div>
                    </div>


                    <div className={classes.container3}>
                        <div className={classes.container4}>
                            <div className={classes.count}>
                                {countEvent}
                            </div>
                            <div className={classes.text}>
                                МЕРОПРИЯТИЙ
                            </div>
                        </div>
                        <div className={classes.container4}>
                            <div className={classes.count}>
                                {countPlaces}
                            </div>
                            <div className={classes.text}>
                                ЗАВЕДЕНИЙ
                            </div>
                        </div>
                        <div className={classes.container4}>
                            <div className={classes.count}>
                                {countCities}
                            </div>
                            <div className={classes.text}>
                                ГОРОДА
                            </div>
                        </div>
                    </div>
                </div>

                <nav className={classes.navigation}>
                    <Link to="/profile" className={classes.link}>ПРОФИЛЬ</Link>
                    <Link to="/" className={classes.link}>Подписки</Link>
                    <Link to="/" className={classes.link}>История посещений</Link>
                    <Link to="/" className={classes.link}>Персональные купоны</Link>
                </nav>

                <div className={classes.container5}>
                    <img
                        src={bell}
                        alt="bell"
                        width={38}
                        height={47}
                    />
                    <div className={classes.ball}/>
                    <img
                        src={like}
                        alt="like"
                        width={51}
                        height={45}
                    />
                </div>

                <div className={classes.container6}>
                    <div className={classes.city}>ТОМСК</div>
                    <img
                        src={location}
                        alt="location"
                        width={42}
                        height={56}
                    />
                </div>

            </div>
        </div>
    );
};

export default ProfileModal;