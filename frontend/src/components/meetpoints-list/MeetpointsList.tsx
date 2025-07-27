import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from "./MeetpointsList.module.css";
import MeetpointCard from "../../entities/meetpoint/MeetpointCard";

interface Meetpoint {
    meetpointId: number;
    title: string;
    description: string;
    address: string;
    date: string;
    time: string;
    images: string[];
    eventHostId: number;
    maxMembers: number;
    membersId: number[];
    createdAt: string;
}

interface ApiResponse {
    success: boolean;
    meetpoints: Meetpoint[];
}

const MeetpointsList = () => {
    const [meetpoints, setMeetpoints] = useState<Meetpoint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMeetpoints = async () => {
            try {
                const response = await axios.get<ApiResponse>('http://localhost:5000/api/meetpoints');
                if (response.data.success) {
                    setMeetpoints(response.data.meetpoints);
                } else {
                    setError('Failed to fetch meetpoints');
                }
            } catch (err) {
                setError('Error fetching meetpoints');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMeetpoints();
    }, []);

    const handleMeetpointClick = (meetpointId: number) => {
        navigate(`/meetpoint/${meetpointId}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={classes.list}>
            {meetpoints.map(meetpoint => (
                <div
                    key={meetpoint.meetpointId}
                    onClick={() => handleMeetpointClick(meetpoint.meetpointId)}
                    className={classes.clickableItem}
                >
                    <MeetpointCard meetpoint={meetpoint} />
                </div>
            ))}
        </div>
    );
};

export default MeetpointsList;