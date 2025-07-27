import React, { useState } from 'react';
import EventItem from "../../components/event-item/EventItem";
import BigEventItem from "../../components/big-event-item/BigEventItem";
import Modal from '../../components/modal/Modal';
import classes from "./EventList.module.css";
import photo from "../../assets/default.jpg";

interface Event {
    id: number;
    name: string;
    address: string;
    image: string;
    description: string;
}

const EventList = () => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const events: Event[] = [
        {
            id: 1,
            name: "Собеседование №1",
            address: "Красноармейская улица, 146",
            image: photo,
            description: "Описание первого собеседования"
        },
        {
            id: 2,
            name: "Собеседование №2",
            address: "Красноармейская улица, 147",
            image: photo,
            description: "Описание второго собеседования"
        },
        {
            id: 3,
            name: "Собеседование №3",
            address: "улица Нахимова, 8/4",
            image: photo,
            description: "Описание третьего собеседования"
        }
    ];

    return (
        <div className={classes.list}>
            {events.map(event => (
                <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={classes.clickableItem}
                >
                    <EventItem event={event} />
                </div>
            ))}

            <Modal
                isOpen={selectedEvent !== null}
                onClose={() => setSelectedEvent(null)}
            >
                {selectedEvent && <BigEventItem event={selectedEvent} />}
            </Modal>
        </div>
    );
};

export default EventList;