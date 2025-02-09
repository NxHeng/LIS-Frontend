import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const CaseContext = createContext();

import { useTaskContext } from './TaskContext';

const API_URL = import.meta.env.VITE_API_URL;

export const CaseContextProvider = ({ children }) => {
    const [caseItems, setCaseItems] = useState([]);
    const [caseItemsLoaded, setCaseItemsLoaded] = useState(false);
    const [isTemporary, setIsTemporary] = useState(false);

    const [fromTasks, setFromTasks] = useState(false);
    const [fromCase, setFromCase] = useState(false);
    const [fromNotificationsToTasks, setFromNotificationsToTasks] = useState(false);
    const [fromNotificationsToCaseDetails, setFromNotificationsToCaseDetails] = useState(false);
    const [detailView, setDetailView] = useState('matterDetails');

    const [view, setView] = useState('myCases');
    const [filteredCases, setFilteredCases] = useState('active');
    const [filteredCategory, setFilteredCategory] = useState('All');
    const [formData, setFormData] = useState({
        matterName: '',
        fileReference: '',
        clerkInCharge: '',
        clients: [{ id: 0, name: '', icNumber: '' }],
        categoryId: '',
        fields: []
    });

    const { setTask } = useTaskContext();

    // Case List Page
    const toMyCases = (userId, token) => {
        setView('myCases');
        // console.log(view);
        fetchMyCases(userId, token);
    };

    const toAllCases = (token) => {
        setView('allCases');
        // console.log(view);
        fetchCases(token);
    };

    const filterActiveCases = () => {
        setFilteredCases('active');
        // console.log('Filtering active cases');
    };

    const filterClosedCases = () => {
        setFilteredCases('closed');
        // console.log('Filtering closed cases');
    };

    // Details Page
    const toMatterDetails = () => {
        setTask(null);
        setDetailView('matterDetails');
    }

    const toEditMatterDetails = () => {
        setDetailView('editMatterDetails');
    }

    const toCaseDetails = () => {
        setTask(null);
        setDetailView('caseDetails');
    }

    const toEditCaseDetails = () => {
        setDetailView('editCaseDetails');
    }

    const toTasks = () => {
        setDetailView('tasks');
        setFromTasks(false);
        // console.log('fromTasks:', fromTasks);
    }

    const toDocuments = () => {
        setTask(null);
        setDetailView('documents');
    }

    const createCase = async (formData, token) => {
        try {
            const response = await fetch(`${API_URL}/case/createCase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCase = async (id, authToken) => {
        try {
            const response = await fetch(`${API_URL}/case/getCase/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            localStorage.setItem('caseItem', JSON.stringify(data));
            return data;
        } catch (error) {
            console.error(error);
        }
    };


    const fetchCases = async (authToken) => {
        setCaseItemsLoaded(false);
        try {
            const response = await fetch(`${API_URL}/case/getCases`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCaseItems(data);
            setCaseItemsLoaded(true);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCasesByClient = async (icNumber, authToken) => {
        setCaseItemsLoaded(false);
        try {
            const response = await fetch(`${API_URL}/case/getCasesByClient/${icNumber}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCaseItems(data);
            setCaseItemsLoaded(true);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMyCases = async (userId, authToken) => {
        setCaseItemsLoaded(false);
        try {
            const response = await fetch(`${API_URL}/case/getMyCases/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCaseItems(data);
            setCaseItemsLoaded(true);
        } catch (error) {
            console.error(error);
        }
    };

    const updateCaseAsClosedState = async (id) => {
        const updatedCaseItems = caseItems.map((item) => {
            if (item._id === id) {
                return { ...item, status: 'closed' };
            }
            return item;
        });
        setCaseItems(updatedCaseItems);
    };

    const updateCaseAsClosedInDatabase = async (id, authToken) => {
        try {
            const response = await fetch(`${API_URL}/case/updateCase/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ status: 'closed' }),
            });
            const data = await response.json();
            console.log(data);
            updateCaseAsClosedState(id);
        } catch (error) {
            console.error(error);
        }
    }

    const updateCaseInDatabase = async (caseId, updatedData, authToken) => {
        try {
            const response = await fetch(`${API_URL}/case/updateCase/${caseId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                throw new Error("Failed to update task in database");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating case:', error);
        }
    };

    const generateLink = async (caseId, authToken) => {
        try {
            const response = await fetch(`${API_URL}/link/generate-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ caseId }),
            });

            if (!response.ok) {
                throw new Error(`Failed to generate link: ${response.statusText}`);
            }
            // Parse the response body as JSON
            const data = await response.json();
            // const tempLink = `${window.location.origin}/temporary/${caseId}/${data.token}`;
            console.log('Temporary link generated:', data.url);

            // Copy the link to clipboard
            await navigator.clipboard.writeText(data.url);
            console.log('Temporary link copied to clipboard.');

            console.log('QR Code in context:', data.qrCode);

            return { url: data.url, qrCode: data.qrCode };
        } catch (error) {
            console.error('Error generating link:', error);
        }
    };

    const addLog = async (caseId, logMessage, userId, authToken) => {
        try {
            const response = await fetch(`${API_URL}/case/addLog/${caseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ logMessage, createdBy: userId }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteLog = async (caseId, logId, authToken) => {
        try {
            const response = await fetch(`${API_URL}/case/deleteLog/${caseId}/${logId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            if (response.ok) {
                console.log(`Log with ID ${logId} deleted successfully.`);
            } else {
                console.error(`Failed to delete log with ID ${logId}:`, response.status);
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error deleting log:', error);
        }
    };


    return (
        <CaseContext.Provider value={{
            view,
            toMyCases,
            toAllCases,
            filteredCases,
            setFilteredCases,
            filterActiveCases,
            filterClosedCases,
            filteredCategory,
            setFilteredCategory,
            caseItems,
            detailView,
            toMatterDetails,
            toEditMatterDetails,
            toCaseDetails,
            toEditCaseDetails,
            toTasks,
            toDocuments,
            formData,
            setFormData,
            createCase,
            fetchCases,
            fetchMyCases,
            fetchCase,
            updateCaseAsClosedInDatabase,
            updateCaseInDatabase,
            caseItemsLoaded,
            setDetailView,
            fromTasks,
            setFromTasks,
            fromNotificationsToTasks,
            setFromNotificationsToTasks,
            fromNotificationsToCaseDetails,
            setFromNotificationsToCaseDetails,
            fetchCasesByClient,
            generateLink,
            isTemporary,
            setIsTemporary,
            addLog,
            deleteLog,
            fromCase,
            setFromCase,
        }}>
            {children}
        </CaseContext.Provider>
    );
};

export const useCaseContext = () => useContext(CaseContext);