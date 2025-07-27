import React from 'react';
import classes from "../styles/Card.module.css";
import MyButton from "../../components/UI/button/MyButton";

interface EntertainmentCardProps {
    image: string;
    name: string;
    description: string;
    address: string;
    onButtonClick?: () => void;
}

const EntertainmentCard: React.FC<EntertainmentCardProps> = ({
                                                 image,
                                                 name,
                                                 description,
                                                 address,
                                                 onButtonClick
                                             }) => {
    return (
        <div className={classes.container}>
            <img
                src={image}
                alt="Картинка мероприятия"
                width={300}
                height={240}
            />

            <div className={classes.name}>
                {name}
            </div>
            <div className={classes.description}>
                {description}
            </div>
            <div className={classes.bottomBlock}>
                <div className={classes.address}>
                    Адрес: {address}
                </div>
                <MyButton
                    text={"Выбрать"}
                    onClick={onButtonClick}
                    style={{
                        fontSize: "16px",
                        padding: "16px 114.33px",
                        backgroundColor: "#25A9F0",
                        marginTop: "20px",
                        borderRadius: "16px"
                    }}
                />
            </div>
        </div>
    );
};

export default EntertainmentCard;