import React, { createContext, useContext, useState } from 'react';

const CaseContext = createContext();

export const CaseContextProvider = ({ children }) => {
    const [view, setView] = useState('myCases');
    const [filteredCases, setFilteredCases] = useState('active');
    const [filteredCategory, setFilteredCategory] = useState('All');

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

    return (
        <CaseContext.Provider value={{
            view,
            toMyCases,
            toAllCases,
            filteredCases,
            filterActiveCases,
            filterClosedCases,
            filteredCategory,
            filterCategory
        }}>
            {children}
        </CaseContext.Provider>
    );
};

export const useCaseContext = () => useContext(CaseContext);