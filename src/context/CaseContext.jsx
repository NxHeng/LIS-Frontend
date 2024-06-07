import React, { createContext, useContext, useState } from 'react';

const CaseContext = createContext();

import { useTaskContext } from './TaskContext';

export const CaseContextProvider = ({ children }) => {
    const [caseItems, setCaseItems] = useState([
        { id: 1, title: "case 1", date: "6-6-2024", task: "Task 1" }, 
        { id: 2, title: "case 2", date: "4-6-2024", task: "Task 2" }, 
        { id: 3, title: "case 3", date: "3-6-2024", task: "Task 3" }]);
    const [detailView, setDetailView] = useState('matterDetail');

    const [view, setView] = useState('myCases');
    const [filteredCases, setFilteredCases] = useState('active');
    const [filteredCategory, setFilteredCategory] = useState('All');

    const { setTask } = useTaskContext();

    // Case List Page
    const toMyCases = () => {
        setView('myCases');
        console.log(view);
    };

    const toAllCases = () => {
        setView('allCases');
        console.log(view);
    };

    const filterActiveCases = () => {
        setFilteredCases('active');
        console.log('Filtering active cases');
    };

    const filterClosedCases = () => {
        setFilteredCases('closed');
        console.log('Filtering closed cases');
    };

    const filterCategory = (category) => {
        setFilteredCategory(category);
        console.log(`Filtering ${category} cases`);
    };

    // Details Page
    const toMatterDetails = () => {
        setTask(null);
        setDetailView('matterDetails');
    }

    const toCaseDetails = () => {
        setTask(null);
        setDetailView('caseDetails');
    }

    const toTasks = () => {
        setDetailView('tasks');
    }

    const toDocuments = () => {
        setTask(null);
        setDetailView('documents');
    }


    return (
        <CaseContext.Provider value={{
            view,
            toMyCases,
            toAllCases,
            filteredCases,
            filterActiveCases,
            filterClosedCases,
            filteredCategory,
            filterCategory,
            caseItems,
            detailView,
            toMatterDetails,
            toCaseDetails,
            toTasks,
            toDocuments
        }}>
            {children}
        </CaseContext.Provider>
    );
};

export const useCaseContext = () => useContext(CaseContext);