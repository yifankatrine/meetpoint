import React, { useState, useRef, ChangeEvent } from 'react';
import './profile-page.css';
import pencil from '../../assets/profile/pencil.svg';
import friends from '../../assets/profile/friends.svg';
import make from '../../assets/profile/make.svg';
import image from '../../assets/profile/image.svg';
import exit from '../../assets/profile/exit.svg';

interface Sticker {
    id: number;
    x: number;
    y: number;
    url: string;
}

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState({
        name: 'Александра',
        username: '@alexandra_drama',
        status: 'ИМПЕРАТОР ТУСОВОК',
        photo: localStorage.getItem('userPhoto') || 'https://via.placeholder.com/200',
        isPremium: true,
        visitCount: 42,
    });

    const [stickers, setStickers] = useState<Sticker[]>(() => {
        const savedStickers = localStorage.getItem('userStickers');
        return savedStickers ? JSON.parse(savedStickers) : [];
    });

    const [isEditingPhoto, setIsEditingPhoto] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [nextStickerId, setNextStickerId] = useState(() => {
        const savedStickers = localStorage.getItem('userStickers');
        if (savedStickers) {
            const stickers = JSON.parse(savedStickers);
            return stickers.length > 0 ? Math.max(...stickers.map((s: Sticker) => s.id)) + 1 : 1;
        }
        return 1;
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const photoContainerRef = useRef<HTMLDivElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const newPhoto = event.target.result as string;
                    setUser({ ...user, photo: newPhoto });
                    localStorage.setItem('userPhoto', newPhoto);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, name: e.target.value });
    };

    const saveName = () => {
        setIsEditingName(false);
    };

    const handlePhotoClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isEditingPhoto || !photoContainerRef.current) return;

        const container = photoContainerRef.current;
        const rect = container.getBoundingClientRect();

        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (fileEvent) => {
            const target = fileEvent.target as HTMLInputElement;
            if (target.files && target.files[0]) {
                const reader = new FileReader();
                reader.onload = (readEvent) => {
                    if (readEvent.target?.result) {
                        const newSticker: Sticker = {
                            id: nextStickerId,
                            x,
                            y,
                            url: readEvent.target.result as string,
                        };
                        const updatedStickers = [...stickers, newSticker];
                        setStickers(updatedStickers);
                        setNextStickerId(nextStickerId + 1);
                        localStorage.setItem('userStickers', JSON.stringify(updatedStickers));
                    }
                };
                reader.readAsDataURL(target.files[0]);
            }
        };
        input.click();
    };

    const removeSticker = (id: number) => {
        const updatedStickers = stickers.filter(sticker => sticker.id !== id);
        setStickers(updatedStickers);
        localStorage.setItem('userStickers', JSON.stringify(updatedStickers));
    };

    const togglePhotoEditMode = () => {
        setIsEditingPhoto(!isEditingPhoto);
    };

    const getStatus = () => {
        const count = user.visitCount;
        if (count > 30) return 'ИМПЕРАТОР ТУСОВОК';
        if (count > 15) return 'Любитель тусовок';
        if (count > 5) return 'Новичок в тусовках';
        return 'Зритель';
    };

    return (
        <div className="profile-room__profile-room">

            {/* Градиентный фон (ниже всего) */}
            <div className="profile-room__gradient-background"></div>

            {/* Основной контент (выше фона) */}
            <div className="profile-room__content-wrapper">
                {/* Контейнер для фото профиля */}
                <div className="profile-room__photo-container-wrapper">
                    <div
                        ref={photoContainerRef}
                        className={`profile-room__photo-container ${isEditingPhoto ? 'editing' : ''}`}
                        onClick={handlePhotoClick}
                    >
                        <img src={user.photo} alt="User" className="profile-room__user-photo" />
                        {stickers.map((sticker) => (
                            <div
                                key={sticker.id}
                                className="profile-room__sticker"
                                style={{
                                    left: `${sticker.x}%`,
                                    top: `${sticker.y}%`,
                                    backgroundImage: `url(${sticker.url})`,
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isEditingPhoto) removeSticker(sticker.id);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="profile-room__profile-info-card">
                <div className='profile-room__profile'>
                    <div className='profile-room__name'>
                        <div className="profile-room__name-section">
                            {isEditingName ? (
                                <div className="profile-room__name-edit">
                                    <input
                                        type="text"
                                        ref={nameInputRef}
                                        value={user.name}
                                        onChange={handleNameChange}
                                        className="profile-room__name-input"
                                        maxLength={20}
                                    />
                                    <button
                                        onClick={saveName}
                                        className="profile-room__save-name-button"
                                    >
                                        ✓
                                    </button>
                                </div>
                            ) : (
                                <div className="profile-room__name-display">
                                    <h2>{user.name}</h2>
                                    <button
                                        onClick={() => {
                                            setIsEditingName(true);
                                            setTimeout(() => nameInputRef.current?.focus(), 0);
                                        }}
                                        className="profile-room__edit-name-button"
                                    >
                                        <img src={pencil} alt="pencil" className="rokky-mitty__pencil" />
                                    </button>
                                </div>
                            )}
                            <button className='profile-room__premium'>
                                {user.isPremium && <span className="profile-room__premium-badge">PREMIUM</span>}
                            </button>
                        </div>
                        <p className="profile-room__username">{user.username}</p>
                    </div>
                    <button className="profile-room__logout-button">
                        <img src={exit} alt="exit" className="profile-room__exit" />Выйти</button></div>


                <div className="profile-room__section">
                    <div className="profile-room__status-section">
                        <button
                            className="profile-room__action-button change-photo"
                            onClick={() => {
                                if (isEditingPhoto) {
                                    togglePhotoEditMode();
                                } else {
                                    fileInputRef.current?.click();
                                }
                            }}
                        >
                            {isEditingPhoto ? 'Добавить стикер' : 'Сменить фото'}
                        </button>
                        <div className="profile-room__status" data-text={getStatus()}>
                            {getStatus()}
                        </div>
                    </div>

                    <div className="profile-room__action-buttons">
                        <div className='profile-room__lenta'>
                            <button className="profile-room__action-button small">
                                <img src={make} alt="make" className="profile-room__make" /><div className="profile-room__bt">
                                Создать</div></button>
                        </div>
                        <div className='profile-room__lenta'>
                            <button className="profile-room__action-button small"><div className="profile-room__bt2">
                                <img src={friends} alt="friends" className="profile-room__friends" />
                                Друзья</div></button>
                        </div>
                        <div className='profile-room__lenta'>
                            <button className="profile-room__action-button small"><div className="profile-room__bt3">
                                <img src={image} alt="image" className="profile-room__image" />
                                Галерея</div>  </button>
                        </div>
                    </div>
                </div>

                <div className="profile-room__buttons-container">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />



                    {isEditingPhoto && (
                        <button
                            className="profile-room__action-button secondary"
                            onClick={togglePhotoEditMode}
                        >
                            Готово
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;