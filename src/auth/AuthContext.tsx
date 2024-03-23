// AuthContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => void;
    register: (username: string, email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (username: string, password: string) => {
        // Your authentication logic here (e.g., API call to backend)
        // Set user if authentication is successful
    };

    const register = (username: string, email: string, password: string) => {
        // Your registration logic here (e.g., API call to backend)
        // Set user if registration is successful
    };

    const logout = () => {
        // Clear user data (e.g., remove token)
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
