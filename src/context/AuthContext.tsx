import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
    id: string;
    name: string;
    email: string;
    diet: 'all' | 'veg' | 'vegan' | 'non-veg';
    eliteStatus: boolean;
    points: number;
}

interface AuthContextType {
    user: User | null;
    login: (userData: Partial<User>) => void;
    logout: () => void;
    updateDiet: (diet: User['diet']) => void;
    toggleElite: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : {
            id: '1',
            name: 'Athlete Guest',
            email: 'athlete@example.com',
            diet: 'all',
            eliteStatus: false,
            points: 150
        };
    });

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    const login = (userData: Partial<User>) => {
        setUser(prev => ({ ...prev, ...userData } as User));
    };

    const logout = () => {
        setUser(null);
    };

    const updateDiet = (diet: User['diet']) => {
        if (user) {
            setUser({ ...user, diet });
        }
    };

    const toggleElite = () => {
        if (user) {
            setUser({ ...user, eliteStatus: !user.eliteStatus });
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateDiet, toggleElite }}>
            {children}
        </AuthContext.Provider>
    );
};
