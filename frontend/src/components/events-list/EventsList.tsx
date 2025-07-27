import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../../entities/event/EventCard';
import image from "../../assets/default.jpg";
import classes from "./EventsList.module.css";

interface Event {
    eventId: number;
    title: string;
    description: string;
    address: string;
    date: string;
    time: string;
    category: number[];
    images: string[];
}

interface ApiResponse {
    success: boolean;
    events: Event[];
}

const EventsList = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get<ApiResponse>('http://localhost:5000/api/events');

                if (response.data.success) {
                    setEvents(response.data.events);
                } else {
                    throw new Error('Server returned success: false');
                }
            } catch (err) {
                setError(axios.isAxiosError(err)
                    ? err.message
                    : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <div className={classes.loading}>Загрузка мероприятий...</div>;
    }

    if (error) {
        return <div className={classes.error}>Ошибка: {error}</div>;
    }

    if (events.length === 0) {
        return <div className={classes.empty}>Нет доступных мероприятий</div>;
    }

    return (
        <div className={classes.eventsGrid}>
            {events.map(event => (
                <EventCard
                    key={event.eventId}
                    image={image}
                    name={event.title}
                    description={event.description}
                    address={event.address}
                    onButtonClick={() => console.log(`Выбрано мероприятие: ${event.title}`)}
                />
            ))}
        </div>
    );
};

export default EventsList;