import React, { createContext, useContext, useState } from 'react';

const CategoryContext = createContext();

export const CategoryContextProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState({});

    //

    return (
        <CategoryContext.Provider value={{ category, categories }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategoryContext = () => useContext(CategoryContext);
