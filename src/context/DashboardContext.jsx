import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const DashboardContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const DashboardContextProvider = ({ children }) => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await axios.get(`${API_URL}/dashboard/getStatistics`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setStatistics(response.data);
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardContext.Provider value={{ statistics, loading, fetchStatistics }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => useContext(DashboardContext);
