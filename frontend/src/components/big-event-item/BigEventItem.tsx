import React, { useState } from 'react';
import classes from './BigEventItem.module.css';
import pin from "../../assets/pin.svg";

interface Event {
    id: number;
    name: string;
    address: string;
    image: string;
    description: string;
}

interface BigEventItemProps {
    event: Event;
}

const BigEventItem: React.FC<BigEventItemProps> = ({ event }) => {
    const [active, setActive] = useState(3);
    const [total, setTotal] = useState(6);

    return (
        <div className={classes.background}>
            <div className={classes.container}>
                <img
                    src={event.image}
                    alt="photo-event"
                    className={classes.image}
                    width={510}
                    height={510}
                />
                <div className={classes.info}>
                    <div className={classes.title}>{event.name}</div>
                    <div className={classes.cont}>
                        <img
                            className={classes.pin}
                            src={pin}
                            alt="pin"
                            width={50}
                            height={50}
                        />
                        <div className={classes.address}>{event.address}</div>
                    </div>
                    <div className={classes.description}>
                        {event.description}
                    </div>
                    <div className={classes.places}>
                        <div className={classes.place}>
                            Места: {active}/{total}
                        </div>
                        <a href="#" className={classes.registration}>
                            Зарегистрироваться
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BigEventItem;