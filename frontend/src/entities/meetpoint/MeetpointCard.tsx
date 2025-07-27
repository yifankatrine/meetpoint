import React from "react";
import pin from "../../assets/pin.svg";
import classes from "./MeetpointCard.module.css";
import defaultPhoto from "../../assets/default.jpg"

interface Meetpoint{
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

interface MeetpointCardProps {
    meetpoint: Meetpoint;
}

const MeetpointCard: React.FC<MeetpointCardProps> = ({ meetpoint }) => {
    return (
        <div className={classes.item}>
            <img
                className={classes.image}
                src={defaultPhoto}
                alt="photo-event"
                width={150}
                height={150}
            />
            <div className={classes.container}>
                <div className={classes.title}>{meetpoint.title}</div>
                <div className={classes.cont}>
                    <img
                        className={classes.pin}
                        src={pin}
                        alt="pin"
                        width={28}
                        height={28}
                    />
                    <div className={classes.address}>{meetpoint.address}</div>
                </div>
            </div>
        </div>
    );
};

export default MeetpointCard;