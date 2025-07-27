import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './authorization-page.css';
import MyButtonText from "../../components/UI/buttonText/MyButtonText";
import MyButton from "../../components/UI/button/MyButton";
import vk from "../../assets/vk.svg";
import google from "../../assets/google.svg";
import yandex from "../../assets/yandex.svg";
import classes from "../../styles/input.module.css";
import {toast} from "react-toastify";

const AuthorizationPage = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/api/login", {
                login,
                password
            });

            if (response.data.success && response.data.token) {
                localStorage.setItem("token", response.data.token);
                toast.success('Вы вошли в аккаунт');
                navigate("/");
            } else {
                toast.error('Ошибка авторизации');
            }
        } catch (err) {
            const errorMessage =
                axios.isAxiosError(err)
                    ? err.response?.data?.message || err.message
                    : "Неизвестная ошибка";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClickToRegistration = () => {
        navigate("/registration");
    };

    const handleClickToPasswordRecovery = () => {
        navigate("/password-recovery");
    };

    return (
        <div className="authorization-page">
            <div className="authorization-page__window">
                <form onSubmit={handleLogin} className={classes.form}>
                    <div className="authorization-page__title">
                        <div className="authorization-page__text">Войти в аккаунт</div>
                        <div className="authorization-page__line"/>
                    </div>

                    <div className={classes.inputGroup}>
                        <label className={classes.inputLabel}>Логин:</label>
                        <input
                            type="text"
                            name="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={classes.input}
                            placeholder="Пароль"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <MyButtonText
                        onClick={handleClickToPasswordRecovery}
                        style={{
                            color: "#00A2FF",
                            fontSize: "16px",
                            marginRight: "295px"
                        }}
                        text={'Восстановить'}
                    />
                    <MyButton
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            padding: "10px 70px"
                        }}
                    >
                        {isSubmitting ? 'Вход...' : 'Войти'}
                    </MyButton>
                </form>
            </div>

            <MyButtonText
                onClick={handleClickToRegistration}
                style={{
                    color: "#FFFFFF",
                    fontSize: "22px",
                    marginTop: "20px",
                }}
                text={'Зарегистрироваться'}
            />

            <div className="authorization-page__social">
                <img
                    src={yandex}
                    alt="yandex"
                    width={62}
                    height={62}
                />
                <img
                    src={vk}
                    alt="vk"
                    width={62}
                    height={62}
                />
                <img
                    src={google}
                    alt="google"
                    width={62}
                    height={62}
                />
            </div>
        </div>
    );
};

export default AuthorizationPage;