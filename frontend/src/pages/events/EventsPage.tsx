import './events-page.css';
import MyTitle from "../../components/title/MyTitle";
import MyBanner from "../../components/UI/banner/MyBanner";
import MyFilter from "../../components/filter/MyFilter";
import vr from '../../assets/events-variables/vr.svg';
import theater from '../../assets/events-variables/theater.svg';
import rectangle from '../../assets/events-variables/rectangle.svg';
import paw from '../../assets/events-variables/paw.svg';
import dino from '../../assets/events-variables/dino.svg';
import cinema from '../../assets/events-variables/cinema.svg';
import bar from '../../assets/events-variables/bar.svg';
import IconsGrid from "../../components/icons-grid/IconsGrid";
import EventsList from "../../components/events-list/EventsList";

interface EventIcon {
    id: number;
    src: string;
    alt: string;
}

const EventsPage = () => {
    const eventIcons: EventIcon[] = [
        { id: 1, src: vr, alt: "VR" },
        { id: 2, src: theater, alt: "Театр" },
        { id: 3, src: paw, alt: "Зоопарк" },
        { id: 4, src: dino, alt: "Музей" },
        { id: 5, src: cinema, alt: "Кино" },
        { id: 6, src: bar, alt: "Бар" },
        { id: 7, src: rectangle, alt: "???" },
        { id: 8, src: rectangle, alt: "???" },
        { id: 9, src: rectangle, alt: "???" },
        { id: 10, src: rectangle, alt: "???" }
    ];

    return (
        <div className="events-page">
            <div className="events-page__container">
                <MyTitle text={"АКТУАЛЬНЫЕ МЕРОПРИЯТИЯ"}/>
                <MyBanner>
                    <div className="text1"></div>
                </MyBanner>

                <IconsGrid
                    icons={eventIcons}
                    itemsPerRow={10}
                    iconSize={80}
                />

                <MyFilter/>
                <EventsList/>
            </div>
        </div>
    );
};

export default EventsPage;