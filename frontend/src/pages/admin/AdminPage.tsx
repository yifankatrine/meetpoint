import React, { useState } from 'react';
import HeaderAdmin from "../../widjets/header-admin/HeaderAdmin";
import AdminNav from "./components/admin-nav/AdminNav";
import styles from './AdminPage.module.css';
import UsersContent from "./components/users-content/UsersContent";
import MeetpointsContent from "./components/meetpoints-content/MeetpointsContent";
import EventsContent from "./components/events-content/EventsContent";
import CitiesContent from "./components/cities-content/CitiesContent";
import EntertainmentContent from "./components/entertainment-content/EntertainmentContent";
import RestaurantsContent from "./components/restaurants-content/Restaurants-Content";


const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <div className={styles.container}>
            <HeaderAdmin/>
            <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className={styles.content}>
                {/* Контент в зависимости от выбранной вкладки */}
                {activeTab === 'пользователи' && <UsersContent/>}
                {activeTab === 'митпоинты' && <MeetpointsContent/>}
                {activeTab === 'мероприятия' && <EventsContent/>}
                {activeTab === 'достопримечательности' && <CitiesContent/>}
                {activeTab === 'развлечения' && <EntertainmentContent/>}
                {activeTab === 'рестораны' && <RestaurantsContent/>}
            </div>
        </div>
    );
};

export default AdminPage;
