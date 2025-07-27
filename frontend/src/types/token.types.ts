export interface TokenResponse {
    isValid: boolean;
    user: TokenInfo;
}

export interface TokenInfo {
    userId: number;
    role: string;
    iat: number;
    exp: number;
    iss: string;
}