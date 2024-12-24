import React, { createContext, useState, useEffect, useContext } from 'react';

const DashboardContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const DashboardContextProvider = ({ children }) => {

    const [statistics, setStatistics] = useState(null);
    const [caseAnalysis, setCaseAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [overallStatus, setOverallStatus] = useState(null);
    const [monthlyStatus, setMonthlyStatus] = useState(null);
    const [yearlyStatus, setYearlyStatus] = useState(null);

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

    const fetchOverallStatus = async () => {
        try {
            // console.log(localStorage.getItem('token'));
            const response = await fetch(`${API_URL}/dashboard/getOverallStatus`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json', 
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setOverallStatus(data);
            // console.log(data);
        }
        catch (error) {
            console.error('Failed to fetch overall status:', error);
        }
        finally {
            setLoading(false);
        }
    }

    const fetchMonthlyStatus = async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`${API_URL}/dashboard/getMonthlyReport/?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json', 
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setMonthlyStatus(data);
            // console.log(data);
        }
        catch (error) {
            console.error('Failed to fetch monthly status:', error);
        }
        finally {
            setLoading(false);
        }
    }

    const fetchYearlyStatus = async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`${API_URL}/dashboard/getYearlyReport/?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json', 
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setYearlyStatus(data);
            // console.log("yearly data here:", data);
        }
        catch (error) {
            console.error('Failed to fetch yearly status:', error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <DashboardContext.Provider value={{
            statistics,
            loading,
            fetchStatistics,
            caseAnalysis,
            fetchCaseAnalysis,
            overallStatus,
            fetchOverallStatus,
            monthlyStatus,
            fetchMonthlyStatus,
            yearlyStatus,
            fetchYearlyStatus,
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = () => useContext(DashboardContext);
