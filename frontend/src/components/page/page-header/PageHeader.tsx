import classes from "./PageHeader.module.css";
import { Link } from 'react-router-dom';
import MyButtonText from "../../UI/buttonText/MyButtonText";
import { useState, useEffect } from "react";
import Modal from "../../modal/Modal";
import ProfileModal from "../../../pages/profile-modal/ProfileModal";

const PageHeader = () => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Проверяем аутентификацию при загрузке компонента
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const openProfileModal = () => setIsProfileModalOpen(true);
    const closeProfileModal = () => setIsProfileModalOpen(false);



    return (
        <header>
            <div className={classes.container}>
                <Link to="/" className={classes.meetpoint}>MEETPOINT</Link>
                <div className={classes.stripe}></div>

                <nav>
                    <Link to="/map" className={classes.link}>Карта</Link>
                    <Link to="/assistant" className={classes.link}>Ваш проводник</Link>
                    <Link to="/tape/recommendations" className={classes.link}>Лента</Link>

                    {isAuthenticated ? (
                        <MyButtonText
                            className={classes.link}
                            text="Профиль"
                            onClick={openProfileModal}
                        />
                    ) : (
                        <Link to="/login" className={classes.link}>Войти</Link>
                    )}
                </nav>
            </div>

            <Modal isOpen={isProfileModalOpen} onClose={closeProfileModal}>
                <ProfileModal />
            </Modal>
        </header>
    );
};

export default PageHeader;