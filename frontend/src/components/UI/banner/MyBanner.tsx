import React, { useState, useEffect } from 'react';
import classes from './MyBanner.module.css';

// Импортируем изображения
import banner1 from '../../../assets/banner1.jpg';
import banner2 from '../../../assets/banner2.jpg';
import banner3 from '../../../assets/banner3.jpg';

interface MyBannerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const bannerImages = [banner1];

const MyBanner: React.FC<MyBannerProps> = ({ children, ...props }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Автоматическая смена слайдов
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
        }, 4000); // каждые 4 секунды

        return () => clearInterval(interval);
    }, []);

    return (
        <button {...props} className={classes.myBanner}>
            <div className={classes.sliderContainer}>
                <div
                    className={classes.slides}
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {bannerImages.map((src, index) => (
                        <div key={index} className={classes.slideItem}>
                            <img src={src} alt={`Slide ${index + 1}`} className={classes.bannerImage} />
                        </div>
                    ))}
                </div>
            </div>

            <div className={classes.contentWrapper}>{children}</div>
        </button>
    );
};

export default MyBanner;