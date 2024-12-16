import React, { createContext, useContext, useState } from 'react';

const CreateContext = createContext();

import { useCategoryContext } from './CategoryContext';

export const CreateContextProvider = ({ children }) => {
  const [view, setView] = useState('newCase');

  const { setSelectedCategoryId } = useCategoryContext();

  // Side navigation
  const toNewCase = () => {
    console.log(view)
    setView('newCase');
  };

  const toNewCaseDetails = () => {
    setView('newCaseDetails');
    console.log(view)
  };

  const toCategories = () => {
    setView('categories');
    console.log(view)
  };

  // CategoryList
  const toNewCategory = () => {
    setView('newCategory');
    console.log(view)
  };

  const toCategoryUpdate = (id) => {
    setSelectedCategoryId(id);
    setView('categoryUpdate');
    console.log(view)
  };

  const toDetailFields = () => {
    setView('detailFields');
    console.log(view)
  };

  const toTaskFields = () => {
    setView('taskFields');
    console.log(view)
  };

  return (
    <CreateContext.Provider value={{
      view,
      toNewCase,
      toNewCaseDetails,
      toCategories,
      toNewCategory,
      toCategoryUpdate,
      toDetailFields,
      toTaskFields,
    }}>
      {children}
    </CreateContext.Provider>
  );
};

export const useCreateContext = () => useContext(CreateContext);
