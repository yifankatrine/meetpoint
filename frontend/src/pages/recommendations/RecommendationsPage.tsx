import './recommendations-page.css'
import MyFilter from "../../components/filter/MyFilter";
import MyTitle from "../../components/title/MyTitle";
import EventsList from "../../components/events-list/EventsList";

const RecommendationsPage = () => {
    return (
        <div className="recommendations-page">
            <div className="recommendations-page__container">
                <MyTitle text={'НА ОСНОВЕ ВАШИХ РЕКОМАНЕДАЦИЙ'}/>
                <MyFilter/>
                <EventsList/>
            </div>
        </div>
    );
};

export default RecommendationsPage;