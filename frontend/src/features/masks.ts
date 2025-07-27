import { useState } from "react";

// Функция для определения, было ли удаление символа
const isDeletion = (oldValue: string, newValue: string): boolean => {
    return oldValue.length > newValue.length;
};

// Маска для телефона
export const formatPhone = (value: string, oldValue: string = ''): string => {
    const numbers = value.replace(/[^\d+]/g, '');
    const isDelete = isDeletion(oldValue, value);

    // Если удаляем символ и это не цифра, просто возвращаем текущее значение
    if (isDelete && !/[\d+]/.test(oldValue[oldValue.length - 1])) {
        return oldValue;
    }

    let formatted = '';
    const digits = numbers.replace(/^\+?[78]/, '').replace(/\D/g, '');

    // Базовый формат
    formatted = '+7';

    // Добавляем части номера только если есть цифры
    if (digits.length > 0) {
        formatted += ` (${digits.substring(0, 3)}`;
    }
    if (digits.length >= 3) {
        formatted += `) ${digits.substring(3, 6)}`;
    }
    if (digits.length >= 6) {
        formatted += `-${digits.substring(6, 8)}`;
    }
    if (digits.length >= 8) {
        formatted += `-${digits.substring(8, 10)}`;
    }

    // Обработка удаления символов
    if (isDelete) {
        // Если удаляем цифру перед разделителем, удаляем и разделитель
        const lastChar = value[value.length - 1];
        if ([' ', ')', '-'].includes(lastChar)) {
            return formatted.substring(0, formatted.length - 1);
        }
    }

    return formatted;
};

export const cleanPhone = (value: string): string => {
    return value.replace(/\D/g, '').replace(/^\+?7/, '');
};

// Маска для даты
export const formatDate = (value: string, oldValue: string = ''): string => {
    const numbers = value.replace(/\D/g, '');
    const isDelete = isDeletion(oldValue, value);

    // Если удаляем символ и это не цифра, просто возвращаем текущее значение
    if (isDelete && !/\d/.test(oldValue[oldValue.length - 1])) {
        return oldValue;
    }

    let formatted = '';

    // Форматируем дату
    if (numbers.length > 0) {
        formatted = numbers.substring(0, 2);
    }
    if (numbers.length >= 2) {
        formatted += `-${numbers.substring(2, 4)}`;
    }
    if (numbers.length >= 4) {
        formatted += `-${numbers.substring(4, 8)}`;
    }

    // Обработка удаления символов
    if (isDelete) {
        // Если удаляем цифру перед разделителем, удаляем и разделитель
        const lastChar = value[value.length - 1];
        if (lastChar === '-') {
            return formatted.substring(0, formatted.length - 1);
        }
    }

    return formatted;
};

export const cleanDate = (value: string): string => {
    return value.replace(/\D/g, '');
};

// Хук для маски телефона
export const usePhoneMask = (initialValue = '') => {
    const [phone, setPhone] = useState(initialValue);
    const [prevValue, setPrevValue] = useState(initialValue);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const newValue = formatPhone(value, prevValue);

        setPrevValue(value);
        setPhone(newValue);

        // Корректировка позиции курсора
        requestAnimationFrame(() => {
            const cursorPos = e.target.selectionStart;
            if (cursorPos !== null) {
                const diff = newValue.length - value.length;
                const newCursorPos = Math.max(0, cursorPos + diff);
                e.target.setSelectionRange(newCursorPos, newCursorPos);
            }
        });
    };

    return {
        phone,
        cleanPhone: () => cleanPhone(phone),
        handlePhoneChange,
        setPhone
    };
};

// Хук для маски даты
export const useDateMask = (initialValue = '') => {
    const [date, setDate] = useState(initialValue);
    const [prevValue, setPrevValue] = useState(initialValue);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const newValue = formatDate(value, prevValue);

        setPrevValue(value);
        setDate(newValue);

        // Корректировка позиции курсора
        requestAnimationFrame(() => {
            const cursorPos = e.target.selectionStart;
            if (cursorPos !== null) {
                const diff = newValue.length - value.length;
                const newCursorPos = Math.max(0, cursorPos + diff);
                e.target.setSelectionRange(newCursorPos, newCursorPos);
            }
        });
    };

    return {
        date,
        cleanDate: () => cleanDate(date),
        handleDateChange,
        setDate
    };
};