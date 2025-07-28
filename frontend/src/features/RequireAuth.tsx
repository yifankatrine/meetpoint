import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { TokenResponse } from "@/types/token.types"

const api = axios.create({
    baseURL: 'http://31.129.58.91:5000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

interface RequireAuthProps {
    requiredRoles: string[];
}

export const RequireAuth = ({ requiredRoles }: RequireAuthProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await api.post<TokenResponse>('/token');

                // Проверяем, что токен валиден и роль пользователя есть в списке разрешенных
                if (response.data.isValid && requiredRoles.includes(response.data.user.role)) {
                    setIsAuthorized(true);
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error validating token:', error);
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [navigate, requiredRoles]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? <Outlet /> : null;
};