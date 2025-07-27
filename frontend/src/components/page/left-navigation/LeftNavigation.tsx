import React from 'react';
import classes from './LeftNavigation.module.css';
import { NavLink } from 'react-router-dom';
import arrowRight from "../../../assets/rokky-page/right-arrow.svg";
import arrowLeft from "../../../assets/rokky-page/left-arrow.svg";
import tomsk from "../../../assets/tomsk.jpg";


interface LeftNavigationProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

const LeftNavigation = ({ isCollapsed, onToggleCollapse }: LeftNavigationProps) => {
    return (
        <div className={`${classes.block} ${isCollapsed ? classes.collapsed : ''}`}>
            <button
                className={classes.arrow}
                onClick={onToggleCollapse}
            >
                <img
                    src={isCollapsed ? arrowRight : arrowLeft}
                    alt={isCollapsed ? "Развернуть" : "Свернуть"}
                    width={38}
                    height={28}
                />
            </button>
            <div className={classes.container}>
                {!isCollapsed && (
                    <>
                        <div className={classes.city}>
                            <img
                                className={classes.photoCity}
                                src={tomsk}
                                alt="Tomsk"
                            />
                            <div className={classes.text}>
                                ТОМСК
                            </div>
                        </div>
                        <nav className={classes.leftNav}>
                            <li><NavLink
                                to="/tape/recommendations"
                                className={({ isActive }) => isActive ? `${classes.link} ${classes.active}` : classes.link
                            }>
                                ЛЕНТА
                            </NavLink></li>
                            <li><NavLink
                                to="/tape/events"
                                className={({ isActive }) => isActive ? `${classes.link} ${classes.active}` : classes.link
                                }>
                                МЕРОПРИЯТИЯ
                            </NavLink></li>
                            <li><NavLink
                                to="/tape/city"
                                className={({ isActive }) => isActive ? `${classes.link} ${classes.active}` : classes.link
                                }>
                                ПРОГУЛКА
                            </NavLink></li>
                            <li><NavLink
                                to="/tape/entertainment"
                                className={({ isActive }) => isActive ? `${classes.link} ${classes.active}` : classes.link
                                }>
                                РАЗВЛЕЧЕНИЯ
                            </NavLink></li>
                            <li><NavLink
                                to="/tape/restaurant"
                                className={({ isActive }) => isActive ? `${classes.link} ${classes.active}` : classes.link
                                }>
                                РЕСТОРАНЫ
                            </NavLink></li>
                            <li><NavLink
                                to="/tape/about-city"
                                className={({ isActive }) => isActive ? `${classes.link} ${classes.active}` : classes.link
                                }>
                                О ГОРОДЕ
                            </NavLink></li>
                        </nav>
                    </>
                )}
            </div>
        </div>
    );
};

export default LeftNavigation;