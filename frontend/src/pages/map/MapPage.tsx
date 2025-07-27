import { useState } from 'react';
import YandexMap from '../../components/YandexMap';

import './map-page.css';
import MySearch from "../../components/UI/search/MySearch";
import MeetpointsList from "../../components/meetpoints-list/MeetpointsList";

const MapPage = () => {
    const [mapCenter, setMapCenter] = useState<[number, number]>([56.470007, 84.967668]); // Москва
    const [mapZoom, setMapZoom] = useState<number>(14);
    const [count, setcount] = useState<number>(26);

    return (
        <div className="map-page">
            <YandexMap center={mapCenter} zoom={mapZoom} />

            <div className="map-page__container">
                <div className="map-page__title">
                    <div className="map-page__text">
                        Митпоинты
                    </div>
                    <div className="map-page__count">
                        {count}
                    </div>
                </div>
                <MySearch/>
                <MeetpointsList/>
            </div>

        </div>
    );
};


export default MapPage;
