import { useParams } from "react-router-dom";
import classes from "./MeetpointDetails.module.css";

import ArrowBack from "./components/arrow-back/ArrowBack";
import PhotosBlock from "./components/photos-block/PhotosBlock";
import ContentBlock from "./components/content-block/ContentBlock";

export default function MeetpointDetails() {
    const { meetpointId } = useParams<{ meetpointId: string }>();

    return (
        <div className={classes.page}>
            <div className={classes.container}>
                <ArrowBack />
                <main>
                    <PhotosBlock meetpointId={Number(meetpointId)} />
                    <ContentBlock meetpointId={Number(meetpointId)} />
                </main>
            </div>
        </div>
    );
}