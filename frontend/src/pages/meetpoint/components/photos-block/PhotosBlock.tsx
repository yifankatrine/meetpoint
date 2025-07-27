import { useEffect, useState } from 'react';
import axios from 'axios';
import classes from "./PhotosBlock.module.css";
import errorImage from "../../assets/default-details-photo.jpg";

interface MeetpointImage {
    url: string;
    isCover?: boolean;
}

interface MeetpointData {
    meetpointId: string;
    title: string;
    description: string;
    address: string;
    date: string;
    time: string;
    images: MeetpointImage[];
    eventHostId: number;
    maxMembers: number;
    membersId: number[];
    createdAt: string;
}

interface PhotosBlockProps {
    meetpointId: number ;
}

const PhotosBlock = ({ meetpointId }: PhotosBlockProps) => {
    const [meetpoint, setMeetpoint] = useState<MeetpointData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMeetpoint = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/meetpoints/${meetpointId}`);
                setMeetpoint(response.data.meetpoint);
            } catch (err) {
                setError('Не удалось загрузить данные о точке встречи');
                console.error('Error fetching meetpoint:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMeetpoint();
    }, [meetpointId]);

    const getFullUrl = (url: string) => {
        // Здесь можно добавить логику преобразования URL при необходимости
        return url;
    };

    if (loading) {
        return <div className={classes.photos}>Загрузка фотографий...</div>;
    }

    if (error) {
        return <div className={classes.photos}>{error}</div>;
    }

    if (!meetpoint) {
        return <div className={classes.photos}>Точка встречи не найдена</div>;
    }

    // Получаем обложку (если есть) или первую фотографию
    const coverImage = meetpoint.images.find(img => img.isCover) || meetpoint.images[0];

    // Получаем миниатюры (исключая обложку, если она есть)
    const thumbnails = meetpoint.images.filter(img => !img.isCover);

    // Если фотографий меньше 4, дополняем массив пустыми значениями
    const displayThumbnails = [...thumbnails];
    while (displayThumbnails.length < 3) {
        displayThumbnails.push({ url: '' });
    }

    return (
        <div className={classes.photos}>
            <img
                className={classes.bigPhoto}
                src={coverImage?.url ? getFullUrl(coverImage.url) : errorImage}
                alt={coverImage?.isCover ? 'Основное фото точки встречи' : 'Фото точки встречи'}
                width={500}
                height={293.1}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = errorImage;
                }}
            />

            <div className={classes.miniPhotos}>
                {displayThumbnails.slice(0, 3).map((photo, index) => (
                    <img
                        key={index}
                        className={classes.miniPhoto}
                        src={photo.url ? getFullUrl(photo.url) : errorImage}
                        alt={photo.url ? `Фото точки встречи ${index + 1}` : 'Заглушка фото'}
                        width={155.19}
                        height={94.33}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = errorImage;
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default PhotosBlock;