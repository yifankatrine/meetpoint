import React, { useEffect, useRef } from 'react';
import classes from './Modal.module.css';
import { useLocation } from 'react-router-dom'; // Добавляем хук для отслеживания URL

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const location = useLocation(); // Получаем текущий маршрут

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    // Закрываем модалку при изменении URL
    useEffect(() => {
        if (isOpen) {
            onClose();
        }
    }, [location.pathname]); // Срабатывает при изменении пути

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={classes.overlay}>
            <div ref={modalRef}>
                {children}
            </div>
        </div>
    );
};

export default Modal;