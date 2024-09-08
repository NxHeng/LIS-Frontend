import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({
    user: null,
    token: null,
    login: () => { },
    register: () => { },
    fetchProfile: () => { },
    logout: () => { },
});

const API_URL = import.meta.env.VITE_API_URL;

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState('testing bruh');
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); // Manage loading state

    useEffect(() => {
        const checkUser = async () => {
            if (token) {
                try {
                    await fetchProfile(token);
                } catch (error) {
                    console.error('Failed to validate token:', error);
                    logout(); // Logout if token validation fails
                }
            }
            setLoading(false); // Finish loading after check
        };
        checkUser();
    }, [token]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/user/login`, { email, password });
            // Ensure correct response data access
            const { token, user } = response.data;
            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true }; // Return success
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            return { success: false, message: error.response?.data?.message || error.message }; // Return error message
        } finally {
            setLoading(false); // End loading
        }
    };

    const register = async (username, email, password) => {
        try {
            await axios.post(`${API_URL}/user/register`, { username, email, password });
            return { success: true };
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };

    const fetchProfile = async (authToken) => {
        try {
            const response = await axios.get(`${API_URL}/user/profile`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch profile:', error.response ? error.response.data : error.message);
        }
    };

    const logout = async () => {
        setLoading(true);
        console.log(`Bearer ${token}`);
        try {
            const response = await axios.post(`${API_URL}/user/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response);
        } catch (error) {
            console.error('Logout failed:', error.response ? error.response.data : error.message);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setLoading(false);
        }
    };
    const changePassword = async ({ oldPassword, newPassword }) => {
        try {
            const response = await axios.post(`${API_URL}/user/changePassword`, {
                oldPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`  // Ensure you're sending the token
                }
            });
            console.log(response);
            return { success: true };
        } catch (error) {
            console.error('Error changing password:', error.response ? error.response.data.message : error.message);
            return { success: false, message: error.response ? error.response.data.message : 'Failed to change password' };
        }
    };



    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, fetchProfile, setUser, setToken, loading, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
