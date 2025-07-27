import React from 'react';

interface MyButtonTextProps {
    text?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const MyButtonText: React.FC<MyButtonTextProps> = ({
                                                       text,
                                                       onClick,
                                                       className = '',
                                                       style,
                                                       children,
                                                   }) => {
    return (
        <button
            onClick={onClick}
            className={`my-button-text ${className}`}
            style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                ...style,
            }}
        >
            {text}{children}
        </button>
    );
};

export default MyButtonText;