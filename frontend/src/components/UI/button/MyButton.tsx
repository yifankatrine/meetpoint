import React from 'react';

interface MyButtonProps {
    text?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    style?: React.CSSProperties;
    type?: 'submit' | 'reset' | 'button';
    disabled?: boolean;
    children?: React.ReactNode;
}

const MyButton: React.FC<MyButtonProps> =
    ({
       text,
       onClick,
       className = '',
       style,
       type = 'button',
       disabled = false,
       children,
   }) => {
    return (
        <button
            onClick={onClick}
            className={`my-button ${className}`}
            type={type}
            disabled={disabled}
            style={{
                color: '#FFFFFF',
                background: disabled ? '#CCCCCC' : '#007DEB',
                border: 'none',
                borderRadius: '30px',
                padding: '10px 60px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease',
                fontSize: '16px',
                fontWeight: '500',
                ...style,
            }}
        >
            {children || text}
        </button>
    );
};

export default MyButton;