import React, { createContext, useState, useEffect, useContext } from 'react';

const DashboardContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const DashboardContextProvider = ({ children }) => {

    const [statistics, setStatistics] = useState(null);
    const [caseAnalysis, setCaseAnalysis] = useState(null);
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

    const fetchCaseAnalysis = async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString(); // Convert filter object to query string
            const response = await fetch(`${API_URL}/dashboard/getCaseAnalysis?${queryParams}`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCaseAnalysis(data);
        }
        catch (error) {
            console.error('Failed to fetch case analysis:', error);
        }
        finally {
            setLoading(false);
        }
    };
    


    return (
        <DashboardContext.Provider value={{
            statistics,
            loading,
            fetchStatistics,
            caseAnalysis,
            fetchCaseAnalysis,

        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => useContext(DashboardContext);
