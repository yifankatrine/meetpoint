import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './registration-page.css';
import MyButtonText from "../../components/UI/buttonText/MyButtonText";
import MyButton from "../../components/UI/button/MyButton";
import classes from "../../styles/input.module.css"
import { NewUser } from "@/types/user.types";
import { formatPhone, formatDate } from "../../features/masks";

const RegistrationPage = () => {
    const [newUser, setNewUser] = useState<NewUser & { confirmPassword: string }>({
        firstName: '',
        secondName: '',
        phone: '',
        birth: '',
        login: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser(prev => ({ ...prev, phone: formatPhone(e.target.value) }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser(prev => ({ ...prev, birth: formatDate(e.target.value) }));
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newUser.password !== newUser.confirmPassword) {
            toast.error('Пароли не совпадают');
            return;
        }

        setIsSubmitting(true);
        setLoading(true);

        try {
            await axios.post('http://localhost:5000/api/registration', {
                firstName: newUser.firstName,
                secondName: newUser.secondName,
                phone: newUser.phone.replace(/\D/g, '').replace(/^\+?7/, ''),
                birth: newUser.birth.replace(/\D/g, ''),
                login: newUser.login,
                password: newUser.password
            });

            setNewUser({
                firstName: '',
                secondName: '',
                phone: '',
                birth: '',
                login: '',
                password: '',
                confirmPassword: ''
            });

            toast.success('Вы зарегистрированы, войдите в аккаунт.');
            navigate("/authorization");

        } catch (err) {
            const errorMessage = axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : err instanceof Error ? err.message : 'Неизвестная ошибка';

            toast.error(`Ошибка: ${errorMessage}`);
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handleClickToAuthorization = () => {
        navigate("/authorization");
    };

    if (loading) return <div className={classes.loading}>Загрузка...</div>;

    return (
        <div className="registration-page">
            <div className="registration-page__window">
                <form onSubmit={handleCreateUser} className={classes.form}>
                    <div className="registration-page__title">
                        <div className="registration-page__text">Регистрация</div>
                        <div className="registration-page__line"/>
                    </div>

                    <div className={classes.inputGroup}>
                        <label className={classes.inputLabel}>Имя:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={newUser.firstName}
                            onChange={handleInputChange}
                            className={classes.input}
                            placeholder="Имя"
                            autoComplete="given-name"
                            required
                        />
                    </div>
                    <div className={classes.inputGroup}>
                        <label className={classes.inputLabel}>Фамилия:</label>
                        <input
                            type="text"
                            name="secondName"
                            value={newUser.secondName}
                            onChange={handleInputChange}
                            className={classes.input}
                            placeholder="Фамилия"
                            autoComplete="family-name"
                            required
                        />
                    </div>
                    <div className={classes.inputGroup}>
                        <label className={classes.inputLabel}>Телефон:</label>
                        <input
                            type="text"
                            name="phone"
                            value={newUser.phone}
                            onChange={handlePhoneChange}
                            className={classes.input}
                            placeholder="+7 (___) ___ __ __"
                            autoComplete="tel"
                            required
                        />
                    </div>
                    <div className={classes.inputGroup}>
                        <label className={classes.inputLabel}>Дата рождения:</label>
                        <input
                            type="text"
                            name="birth"
                            value={newUser.birth}
                            onChange={handleDateChange}
                            className={classes.input}
                            placeholder="ДД-ММ-ГГГГ"
                            autoComplete="bday"
                            required
                        />
                    </div>
                    <div className={classes.inputGroup}>
                        <label className={classes.inputLabel}>Логин:</label>
                        <input
                            type="text"
                            name="login"
                            value={newUser.login}
                            onChange={handleInputChange}
                            className={classes.input}
                            placeholder="Логин"
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div className={classes.inputGroup}>
                        <label className={classes.inputLabel}>Пароль:</label>
                        <input
                            type="password"
                            name="password"
                            value={newUser.password}
                            onChange={handleInputChange}
                            className={classes.input}
                            placeholder="Пароль"
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <div className={classes.inputGroup}>
                        <label className={classes.inputLabel}>Подтвердите пароль:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={newUser.confirmPassword}
                            onChange={handleInputChange}
                            className={classes.input}
                            placeholder="Подтвердите пароль"
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <MyButton
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            padding:"10px 40px"
                        }}
                    >
                        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                    </MyButton>
                </form>
            </div>
            <MyButtonText
                onClick={handleClickToAuthorization}
                style={{
                    color: "#FFFFFF",
                    fontSize: "22px",
                    marginTop: "20px",
                    marginBottom: "50px",
                }}
            >
                Уже есть аккаунт?
            </MyButtonText>
        </div>
    );
};

export default RegistrationPage;