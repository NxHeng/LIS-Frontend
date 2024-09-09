import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const CaseContext = createContext();

import { useTaskContext } from './TaskContext';
import { set } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL;

export const CaseContextProvider = ({ children }) => {
    const [caseItems, setCaseItems] = useState([]);
    const [caseItemsLoaded, setCaseItemsLoaded] = useState(false);
    const [detailView, setDetailView] = useState('matterDetail');

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            <Navigate to="/login" />
        }
    }, [user]);

    const [view, setView] = useState('myCases');
    const [filteredCases, setFilteredCases] = useState('active');
    const [filteredCategory, setFilteredCategory] = useState('All');
    const [formData, setFormData] = useState({
        matterName: '',
        fileReference: '',
        clerkInCharge: '',
        clients: [{ id: 0, value: '' }],
        categoryId: '',
        fields: []
    });
    
    const { setTask, setTasks, setTasksLoaded } = useTaskContext();
    
    // Case List Page
    const toMyCases = () => {
        setView('myCases');
        console.log(view);
        fetchMyCases(user._id);
    };

    const toAllCases = () => {
        setView('allCases');
        console.log(view);
        fetchCases();
    };

    const filterActiveCases = () => {
        setFilteredCases('active');
        console.log('Filtering active cases');
    };

    const filterClosedCases = () => {
        setFilteredCases('closed');
        console.log('Filtering closed cases');
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
    }

    const toDocuments = () => {
        setTask(null);
        setDetailView('documents');
    }

    const createCase = async (formData) => {
        try {
            const response = await fetch(`${API_URL}/case/createCase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCase = async (id) => {
        try {
            const response = await fetch(`${API_URL}/case/getCase/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCases = async () => {
        setCaseItemsLoaded(false);
        try {
            const response = await fetch(`${API_URL}/case/getCases`);
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

    const fetchMyCases = async (userId) => {
        setCaseItemsLoaded(false);
        try {
            const response = await fetch(`${API_URL}/case/getMyCases/${userId}`);
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

    const updateCaseAsClosedInDatabase = async (id) => {
        try {
            const response = await fetch(`${API_URL}/case/updateCase/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
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

    const updateCaseInDatabase = async (caseId, updatedData) => {
        try {
            const response = await fetch(`${API_URL}/case/updateCase/${caseId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            const data = await response.json();
            console.log('Case updated:', data);
        } catch (error) {
            console.error('Error updating case:', error);
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
            caseItemsLoaded
        }}>
            {children}
        </CaseContext.Provider>
    );
};

export const useCaseContext = () => useContext(CaseContext);