import React, { createContext, useContext, useState } from 'react';

const TemplateContext = createContext();

export const TemplateContextProvider = ({ children }) => {
    const [templates, setTemplates] = useState([]);
    const [template, setTemplate] = useState({});

    //

    return (
        <TemplateContext.Provider value={{ template, templates }}>
            {children}
        </TemplateContext.Provider>
    );
};

export const useTemplateContext = () => useContext(TemplateContext);
