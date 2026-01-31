import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('smartpark_user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('smartpark_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('smartpark_user');
        }
    }, [user]);

    // Check valid credentials (MOCK)
    const login = (username, password) => {
        if (username === 'admin' && password === 'admin') {
            setUser({ username: 'admin', role: 'admin' });
            return true;
        }
        if (username === 'user' && password === 'user') {
            setUser({ username: 'user', role: 'customer' });
            return true;
        }
        if (username === 'user2' && password === 'user2') {
            setUser({ username: 'user2', role: 'customer' });
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
