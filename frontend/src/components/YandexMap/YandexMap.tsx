import React, { useRef, useEffect } from 'react';
import styles from './YandexMap.module.css';

import type * as ymaps from 'yandex-maps';

interface YandexMapProps {
    center: [number, number]; // [широта, долгота]
    zoom: number;
}

const YandexMap: React.FC<YandexMapProps> = ({ center, zoom }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<ymaps.Map | null>(null);
    const placemarksRef = useRef<ymaps.Placemark[]>([]);

    useEffect(() => {
        if (window.ymaps && mapContainerRef.current) {
            if (!mapInstanceRef.current) {
                window.ymaps.ready(() => {
                    // Создаем карту
                    mapInstanceRef.current = new window.ymaps.Map(mapContainerRef.current!, {
                        center: center,
                        zoom: zoom,
                        controls: ['zoomControl', 'geolocationControl', 'typeSelector', 'fullscreenControl']
                    });

                    // Координаты меток
                    const markers = [
                        { coords: [56.454001, 84.978389], title: "Собеседование 1", color: "#ff0000" },
                        { coords: [56.453155, 84.975649], title: "Собеседование 2", color: "#0095b6" },
                        { coords: [56.456045, 84.960234], title: "Собеседование 3", color: "#3caa3c" }
                    ];

                    // Создаем и добавляем метки
                    markers.forEach((marker, index) => {
                        const placemark = new window.ymaps.Placemark(
                            marker.coords,
                            {
                                balloonContent: `<strong>${marker.title}</strong><br>Координаты: ${marker.coords.join(', ')}`,
                                iconCaption: marker.title
                            },
                            {
                                preset: 'islands#dotIcon',
                                iconColor: marker.color
                            }
                        );
                        placemarksRef.current.push(placemark);
                        mapInstanceRef.current!.geoObjects.add(placemark);
                    });

                    mapInstanceRef.current!.setBounds(mapInstanceRef.current!.geoObjects.getBounds()!);
                });
            } else {
                mapInstanceRef.current.setCenter(center);
                mapInstanceRef.current.setZoom(zoom);
            }
        }

        return () => {
            if (mapInstanceRef.current) {
                // Удаляем все метки перед уничтожением карты
                placemarksRef.current.forEach(placemark => {
                    mapInstanceRef.current!.geoObjects.remove(placemark);
                });
                placemarksRef.current = [];

                mapInstanceRef.current.destroy();
                mapInstanceRef.current = null;
            }
        };
    }, [center, zoom]);

    return (
        <div
            ref={mapContainerRef}
            className={styles.mapContainer}
            style={{ width: '100%', height: '100vh' }}
        />
    );
};

export default YandexMap;