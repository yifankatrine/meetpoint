import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "./ContentBlock.module.css";
import pin from "../../../../assets/pin.svg";
import clock from "../../../../assets/clock.svg";
import MyButton from "../../../../components/UI/button/MyButton";
import Modal from '../../../../components/modal/Modal';
import classes from "../../../../styles/input.module.css";
import { formatPhone, formatDate } from "../../../../features/masks";
import {useNavigate} from "react-router-dom";
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

interface MeetpointData {
    meetpointId: number;
    title: string;
    description: string;
    address: string;
    date: string;
    time: string;
    images: [];
    eventHostId: number;
    maxMembers: number;
    membersId: number[];
    createdAt: string;
}

interface ContentBlockProps {
    meetpointId: number;
}

interface TokenResponse {
    isValid: boolean;
    user: {
        userId: number;
        role: string;
        iat: number;
        exp: number;
        iss: string;
    };
}

const ContentBlock = ({ meetpointId }: ContentBlockProps) => {
    const [meetpoint, setMeetpoint] = useState<MeetpointData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        birthDate: '',
        telegram: ''
    });
    const [registrationStep, setRegistrationStep] = useState(1);
    const [userId, setUserId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMeetpoint = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/meetpoints/${meetpointId}`);
                setMeetpoint(response.data.meetpoint);
            } catch (err) {
                setError('Не удалось загрузить данные о точке встречи');
                console.error('Error fetching meetpoint:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMeetpoint();
    }, [meetpointId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let formattedValue = value;

        if (name === 'phone') {
            formattedValue = formatPhone(value);
        } else if (name === 'birthDate') {
            formattedValue = formatDate(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const verifyTokenAndGetUserId = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                throw new Error('Токен не найден');
            }

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await api.post<TokenResponse>('/token');

            if (!response.data.isValid) {
                navigate('/login');
                throw new Error('Недействительный токен');
            }

            setUserId(response.data.user.userId);
            return response.data.user.userId;
        } catch (err) {
            console.error('Ошибка при проверке токена:', err);
            throw err;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Шаг 1: Проверка токена и получение userId
            const currentUserId = await verifyTokenAndGetUserId();
            setRegistrationStep(2);

            // Шаг 2: Создание участника (member)
            const memberResponse = await api.post('/members', {
                userId: currentUserId,
                meetpointId: meetpointId,
                name: formData.name,
                phone: formData.phone,
                birth: formData.birthDate,
                tg: formData.telegram
            });

            const newMemberId = memberResponse.data.member.id;

            // Шаг 3: Регистрация участника на мероприятие
            await api.post(`/meetpoints/${meetpointId}/members`, {
                memberId: newMemberId
            });

            // Обновляем данные о мероприятии после успешной регистрации
            const updatedMeetpointResponse = await api.get(`/meetpoints/${meetpointId}`);
            setMeetpoint(updatedMeetpointResponse.data.meetpoint);

            toast.success('Вы зарегистрированы на митпоинт!')
            setIsModalOpen(false);
            setRegistrationStep(1);
            setFormData({
                name: '',
                phone: '',
                birthDate: '',
                telegram: ''
            });
        } catch (err) {
            toast.error('Ошибка регистрации: ${err}')
            console.error('Ошибка регистрации:', err);
            alert('Произошла ошибка при регистрации: ' + (err as Error).message);
            setRegistrationStep(1);
        }
    };

    if (loading) {
        return <div className={styles.content}>Загрузка данных...</div>;
    }

    if (error) {
        return <div className={styles.content}>{error}</div>;
    }

    if (!meetpoint) {
        return <div className={styles.content}>Точка встречи не найдена</div>;
    }

    return (
        <div className={styles.content}>
            <h1 className={styles.title}>Митпоинт:<br/>{meetpoint.title}</h1>
            <h4 className={styles.description}>{meetpoint.description}</h4>

            <div className={styles.infoBlock}>
                <img src={pin} alt="pin" width={17} height={17}/>
                <h4 className={styles.address}>{meetpoint.address}</h4>
            </div>

            <div className={styles.infoBlock}>
                <img src={clock} alt="clock" width={17} height={17}/>
                <h4 className={styles.date}>{meetpoint.date}, {meetpoint.time}</h4>
            </div>

            <div className={styles.infoBlock}>
                Мест: <span className={styles.counter}>
                    {meetpoint.membersId.length}/{meetpoint.maxMembers}
                </span>
            </div>

            <MyButton
                text={"Зарегистрироваться"}
                onClick={() => setIsModalOpen(true)}
                style={{
                    marginTop: "30px",
                    fontSize: "16px",
                    padding: "15.5px 44.5px",
                    borderRadius: "16px",
                }}
                disabled={meetpoint.membersId.length >= meetpoint.maxMembers}
            />

            <Modal isOpen={isModalOpen} onClose={() => {
                setIsModalOpen(false);
                setRegistrationStep(1);
            }}>
                <div className={styles.modalContent}>
                    {registrationStep === 1 ? (
                        <form onSubmit={handleSubmit} className={classes.form}>
                            <label className={classes.inputTitle}>Регистрация на мероприятие</label>

                            <div className={classes.inputGroup}>
                                <label className={classes.inputLabel}>ФИО:</label>
                                <input
                                    className={classes.input}
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="ФИО"
                                    required
                                />
                                <label className={classes.example}>Например: Иванов Иван Иванович</label>
                            </div>

                            <div className={classes.inputGroup}>
                                <label className={classes.inputLabel}>Телефон:</label>
                                <input
                                    className={classes.input}
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+7 (___) ___ __ __"
                                    required
                                />
                            </div>

                            <div className={classes.inputGroup}>
                                <label className={classes.inputLabel}>Дата рождения:</label>
                                <input
                                    className={classes.input}
                                    type="text"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                    placeholder="ДД-ММ-ГГГГ"
                                    required
                                />
                            </div>

                            <div className={classes.inputGroup}>
                                <label className={classes.inputLabel}>Телеграм:</label>
                                <input
                                    className={classes.input}
                                    type="text"
                                    name="telegram"
                                    value={formData.telegram}
                                    onChange={handleInputChange}
                                    placeholder="@username"
                                    required
                                />
                                <label className={classes.example}>Например: @example</label>
                            </div>

                            <div className={classes.formActions}>
                                <MyButton
                                    type="button"
                                    text="Отмена"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setRegistrationStep(1);
                                    }}
                                    style={{
                                        marginRight: "10px",
                                        backgroundColor: "#f0f0f0",
                                        color: "#333"
                                    }}
                                />
                                <MyButton
                                    type="submit"
                                    text="Подтвердить"
                                    style={{
                                        backgroundColor: "#4CAF50",
                                        color: "white"
                                    }}
                                />
                            </div>
                        </form>
                    ) : (
                        <div className={styles.loadingStep}>
                            <h2>Регистрация...</h2>
                            <p>Пожалуйста, подождите, идет обработка вашей заявки</p>
                            <div className={styles.spinner}></div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default ContentBlock;