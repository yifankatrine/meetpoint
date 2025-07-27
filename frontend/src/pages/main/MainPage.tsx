import React from 'react';
import './main-page.css'
import { useNavigate } from "react-router-dom";
import MyButton from "../../components/UI/button/MyButton";
import people from '../../assets/people.jpeg';

const MainPage = () => {
    const toAuthorization = useNavigate();

    const handleClickToAuthorization = () => {
        toAuthorization("/authorization");
    };

    return (
        <div className="main-page">
            <img className='main-page__background' src={people} alt='фон'/>
            <div className='main-page__overlay'/>
            <div className="main-page__content">
                <h1 className='main-page__text1'>Мобильное приложение с твоими встречами</h1>
                <h2 className='main-page__text2'>Записывайся на мероприятия и находи новые знакомства</h2>

                <div className='main-page__buttons'>
                    <MyButton text={'Загрузить'} onClick={handleClickToAuthorization}/>
                    <MyButton text={'О нас'} style={{marginLeft: '30px', backgroundColor: '#FF0505'}}/>
                </div>
            </div>
        </div>
    );
};

export default MainPage;