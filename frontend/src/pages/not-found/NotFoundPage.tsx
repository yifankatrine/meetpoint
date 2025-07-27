import { Link } from "react-router-dom";
import classes from "./NotFoundPage.module.css";
import React from "react";
import mitty404 from '../../assets/404.svg';


const NotFoundPage = () => {
    return (
        <div className={classes.container}>
            <div className={classes.window}>
                <div className={classes.text}>
                    <h1>Кажется что-то пошло не так...</h1>
                    <Link to="/">Вернуться на главную...</Link>
                </div>
                <img
                    src={mitty404}
                    alt="mitty404"
                    className={classes.image}
                    width={233.23}
                    height={545}
                />
            </div>


        </div>
    );
};

export default NotFoundPage;