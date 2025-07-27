import './city-page.css'
import MyBanner from "../../components/UI/banner/MyBanner";
import MyFilter from "../../components/filter/MyFilter";
import MyTitle from "../../components/title/MyTitle";
import IconsGrid from "../../components/icons-grid/IconsGrid";
import park from "../../assets/city-varibles/park.svg"
import monument from "../../assets/city-varibles/monument.svg"
import architecture from "../../assets/city-varibles/architecture.svg"
import CitiesList from "../../components/cities-list/CitiesList";

interface EventIcon {
    id: number;
    src: string;
    alt: string;
}

function CityPage() {
    const eventIcons: EventIcon[] = [
        { id: 1, src: park, alt: "Парк" },
        { id: 2, src: monument, alt: "Достопримечательности" },
        { id: 3, src: architecture, alt: "Архитектура" },
    ];
    return (
        <div className="city-page">
            <div className="city-page__container">
                <MyTitle text={'ДОРОЖНАЯ КАРТА'}/>
                <MyBanner>
                    <div className="text1"></div>
                </MyBanner>
                <IconsGrid
                    icons={eventIcons}
                    itemsPerRow={3}
                    iconSize={114}
                    style={{maxWidth: "773px"}}
                />
                <MyFilter/>
                <CitiesList/>
            </div>
        </div>
    );
}

export default CityPage;