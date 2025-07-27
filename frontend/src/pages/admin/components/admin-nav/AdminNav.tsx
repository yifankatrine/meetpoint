import React from 'react';
import styles from './AdminNav.module.css';

interface AdminNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        'пользователи',
        'митпоинты',
        'мероприятия',
        'достопримечательности',
        'развлечения',
        'рестораны'
    ] as const;

    return (
        <nav className={styles.navigation}>
            {tabs.map(tab => (
                <button
                    key={tab}
                    className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
                    onClick={() => setActiveTab(tab)}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </nav>
    );
};

export default AdminNav;