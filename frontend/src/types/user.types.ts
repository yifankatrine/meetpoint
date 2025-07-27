export interface User {
    id: number;
    firstName: string;
    secondName: string;
    phone: string;
    birth: string;
    login: string;
    password: string;
}

export interface UsersResponse {
    success: boolean;
    users: User[];
}

export interface UserResponse {
    success: boolean;
    user: User;
}

export type NewUser = Omit<User, 'id'>;