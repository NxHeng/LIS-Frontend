import React, { createContext, useState, useEffect, useContext } from 'react';

const DashboardContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const DashboardContextProvider = ({ children }) => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStatistics = async () => {
        try {
            const response = await fetch(`${API_URL}/dashboard/getStatistics`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',  // Optional, depending on the API
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setStatistics(data);
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <DashboardContext.Provider value={{
            statistics,
            loading,
            fetchStatistics
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => useContext(DashboardContext);
