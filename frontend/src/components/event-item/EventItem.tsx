import pin from "../../assets/pin.svg";
import classes from "./EventItem.module.css";

interface Event {
    id: number;
    name: string;
    address: string;
    image: string;
}

interface EventItemProps {
    event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
    return (
        <div className={classes.item}>
            <img
                className={classes.image}
                src={event.image}
                alt="photo-event"
                width={150}
                height={150}
            />
            <div className={classes.container}>
                <div className={classes.name}>{event.name}</div>
                <div className={classes.cont}>
                    <img
                        className={classes.pin}
                        src={pin}
                        alt="pin"
                        width={28}
                        height={28}
                    />
                    <div className={classes.address}>{event.address}</div>
                </div>
            </div>
        </div>
    );
};

export default EventItem;