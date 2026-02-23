import { API_ENDPOINTS } from '../config/api';

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export const authService = {
    async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
        const response = await fetch(API_ENDPOINTS.auth.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Login failed' }));
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    },

    async signup(userData: { email: string; password: string; firstName?: string; lastName?: string }): Promise<AuthResponse> {
        const response = await fetch(API_ENDPOINTS.auth.signup, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Signup failed' }));
            throw new Error(error.message || 'Signup failed');
        }

        return response.json();
    },

    async getMe(token: string): Promise<User> {
        const response = await fetch(API_ENDPOINTS.auth.me, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user profiles');
        }

        return response.json();
    },
};
