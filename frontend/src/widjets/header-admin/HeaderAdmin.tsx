import React from 'react';
import classes from "./HeaderAdmin.module.css";
import { Link } from 'react-router-dom';

const HeaderAdmin = () => {
    return (
        <div className={classes.container}>
            <Link to="/" className={classes.linkLogo}>
                <div className={classes.meetpoint}>MEETPOINT</div>
                <div className={classes.admin}>admin</div>
            </Link>
            <div className={classes.stripe}></div>

            <Link to="/profile" className={classes.link}>
                Профиль
            </Link>
        </div>
    );
};

export default HeaderAdmin;



