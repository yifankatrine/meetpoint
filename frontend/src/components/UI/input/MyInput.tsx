import React, { useState, useEffect, useCallback } from "react";
import classes from "./MyInput.module.css";

interface MyInputProps {
    title?: string;
    type?: "text" | "password" | "email" | "number" | "search" | "date" | "tel";
    value?: string;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    required?: boolean;
    phoneMask?: boolean;
    autoComplete?: string;
}

const MyInput = React.forwardRef<HTMLInputElement, MyInputProps>(
    (
        {
            title,
            type = "text",
            value = "",
            onChange,
            placeholder,
            className = "",
            name,
            style,
            disabled = false,
            required = false,
            phoneMask = false,
            autoComplete = "off",
        },
        ref
    ) => {
        const [displayValue, setDisplayValue] = useState("");

        const formatPhoneNumber = useCallback((input: string): string => {
            // Удаляем все нецифровые символы
            const cleaned = input.replace(/\D/g, "");

            // Начинаем с +7
            let formatted = "+7 ";

            if (cleaned.length > 1) {
                const rest = cleaned.slice(1);

                if (rest.length > 0) {
                    formatted += `(${rest.slice(0, 3)}`;
                }
                if (rest.length > 3) {
                    formatted += `) ${rest.slice(3, 6)}`;
                }
                if (rest.length > 6) {
                    formatted += ` ${rest.slice(6, 8)}`;
                }
                if (rest.length > 8) {
                    formatted += ` ${rest.slice(8, 10)}`;
                }
            }

            return formatted;
        }, []);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let newValue = e.target.value;

            if (phoneMask) {
                // Удаляем все нецифровые символы, кроме начального +7
                const cleaned = newValue.replace(/\D/g, "");
                newValue = cleaned.startsWith("7") ? cleaned : "7" + cleaned.replace(/^7/, "");

                // Ограничиваем длину (10 цифр после 7)
                if (newValue.length > 11) {
                    newValue = newValue.slice(0, 11);
                }

                // Форматируем
                newValue = formatPhoneNumber(newValue);

                // Если пользователь удаляет +7, оставляем +7
                if (newValue.length < 3) {
                    newValue = "+7";
                }
            }

            // Создаем синтетическое событие с новым значением
            const syntheticEvent = {
                ...e,
                target: {
                    ...e.target,
                    value: phoneMask ? newValue.replace(/\D/g, "").slice(1) : newValue,
                },
            };

            onChange?.(syntheticEvent);
            setDisplayValue(newValue);
        };

        useEffect(() => {
            if (phoneMask) {
                if (value) {
                    setDisplayValue(formatPhoneNumber("7" + value));
                } else {
                    setDisplayValue("+7");
                }
            } else {
                setDisplayValue(value || "");
            }
        }, [value, phoneMask, formatPhoneNumber]);

        return (
            <div className={classes.container}>
                {title && <div className={classes.title}>{title}</div>}
                <input
                    ref={ref}
                    type={phoneMask ? "tel" : type}
                    value={displayValue}
                    name={name}
                    onChange={handleChange}
                    placeholder={phoneMask ? "+7 (___) ___ __ __" : placeholder}
                    className={`${classes.myInput} ${className}`}
                    style={style}
                    disabled={disabled}
                    required={required}
                    inputMode={phoneMask ? "tel" : undefined}
                    autoComplete={autoComplete}
                />
            </div>
        );
    }
);

MyInput.displayName = "MyInput";

export default MyInput;