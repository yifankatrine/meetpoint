import React from 'react';
import classes from "./MySearch.module.css";

const MySearch = () => {
    return (
        <div className={classes.search}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" fill="white"/>
                <path d="M20 18H19.41L19.13 17.73C20.19 16.59 20.88 15.11 20.88 13.44C20.88 9.94 18.01 7.06 14.5 7.06C10.99 7.06 8.12 9.94 8.12 13.44C8.12 16.94 10.99 19.81 14.5 19.81C16.17 19.81 17.65 19.12 18.79 18.06L19.06 18.34V19L23.56 23.5L25 22.06L20.5 17.56L20 18ZM14.5 18C12.29 18 10.5 16.21 10.5 14C10.5 11.79 12.29 10 14.5 10C16.71 10 18.5 11.79 18.5 14C18.5 16.21 16.71 18 14.5 18Z" fill="black        "/>
            </svg>
            <div
                style = {{
                    fontSize: '20px',
                    marginLeft: '10px',
                    marginTop: '2px',
                }}
            >
                Поиск
            </div>
        </div>
    );
};

export default MySearch;